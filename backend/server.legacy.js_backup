const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Charger les variables d'environnement
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  }
}

loadEnv();

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `http://localhost:${PORT}/auth/google/callback`;

// URL du site EEUEZ
const EEUEZ_WEBSITE = 'https://www.eeuez.com';

// Vérifications
if (!GEMINI_API_KEY) {
  console.error('❌ ERREUR: GEMINI_API_KEY non trouvée dans .env');
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error('⚠️  ATTENTION: MONGODB_URI non configurée - Les conversations ne seront pas sauvegardées');
}

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('⚠️  ATTENTION: Google OAuth non configuré - L\'authentification ne fonctionnera pas');
}

// Stockage du contenu EEUEZ
let EEUEZ_CONTEXT = '';
let EEUEZ_CONTENT_LOADED = false;

// Charger le contexte personnalisé
const contextPath = path.join(__dirname, 'eeuez-context.txt');
let customContext = '';
if (fs.existsSync(contextPath)) {
  customContext = fs.readFileSync(contextPath, 'utf-8');
  console.log('✅ Fichier eeuez-context.txt chargé');
}

// Stockage en mémoire (sessions et conversations)
const sessions = new Map();
const conversations = new Map();

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// ==================== WEB SCRAPING ====================

function fetchWebContent(url, callback) {
  https.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      callback(null, data);
    });
  }).on('error', (err) => {
    callback(err, null);
  });
}

function extractTextFromHTML(html) {
  // Nettoyer le HTML pour extraire le texte
  let text = html;
  
  // Supprimer les scripts et styles
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Supprimer les balises HTML
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Décoder les entités HTML
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  
  // Nettoyer les espaces multiples
  text = text.replace(/\s+/g, ' ');
  
  // Supprimer les lignes vides
  text = text.replace(/\n\s*\n/g, '\n');
  
  return text.trim();
}

async function loadEEUEZContent() {
  console.log('📡 Chargement du contenu du site EEUEZ...');
  
  return new Promise((resolve) => {
    fetchWebContent(EEUEZ_WEBSITE, (err, html) => {
      if (err) {
        console.error('❌ Erreur lors du chargement du site EEUEZ:', err.message);
        console.log('⚠️  Le chatbot fonctionnera avec un contexte limité');
        EEUEZ_CONTEXT = customContext || 'EEUEZ est une plateforme éducative.';
        EEUEZ_CONTENT_LOADED = false;
        resolve(false);
        return;
      }
      
      // Extraire le texte du HTML
      const textContent = extractTextFromHTML(html);
      
      // Limiter le contenu (Gemini a une limite de tokens)
      const maxLength = 4000; // ~1000 mots
      const truncatedContent = textContent.substring(0, maxLength);
      
      // Construire le contexte complet
      EEUEZ_CONTEXT = `
=== INFORMATIONS OFFICIELLES DU SITE EEUEZ (www.eeuez.com) ===

${truncatedContent}

=== INFORMATIONS COMPLÉMENTAIRES ===

${customContext}

=== FIN DU CONTEXTE ===
`;
      
      EEUEZ_CONTENT_LOADED = true;
      console.log('✅ Contenu du site EEUEZ chargé avec succès');
      console.log(`📊 Taille du contexte: ${EEUEZ_CONTEXT.length} caractères`);
      resolve(true);
    });
  });
}

// ==================== MONGODB ====================

let db = null;

async function connectMongoDB() {
  if (!MONGODB_URI) return null;
  
  try {
    console.log('📦 Connexion à MongoDB...');
    console.log('✅ MongoDB connecté (mode simulation - installez "mongodb" npm package pour production)');
    return true;
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
    return null;
  }
}

async function saveConversationToDB(userId, message, role) {
  if (!conversations.has(userId)) {
    conversations.set(userId, []);
  }
  conversations.get(userId).push({
    role,
    content: message,
    timestamp: new Date().toISOString()
  });
}

async function getConversationHistory(userId) {
  if (!conversations.has(userId)) {
    return [];
  }
  return conversations.get(userId);
}

// ==================== GOOGLE OAUTH ====================

function exchangeCodeForToken(code, callback) {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const postData = new URLSearchParams({
    code: code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code'
  }).toString();

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(tokenUrl, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const tokens = JSON.parse(data);
        if (tokens.error) {
          callback(new Error(tokens.error_description || tokens.error));
        } else {
          callback(null, tokens);
        }
      } catch (error) {
        callback(error);
      }
    });
  });

  req.on('error', callback);
  req.write(postData);
  req.end();
}

function getUserInfo(accessToken, callback) {
  const options = {
    hostname: 'www.googleapis.com',
    path: '/oauth2/v2/userinfo',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };

  https.get(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        callback(null, JSON.parse(data));
      } catch (error) {
        callback(error);
      }
    });
  }).on('error', callback);
}

// ==================== GEMINI API ====================

function callGeminiAPI(userMessage, conversationHistory, callback) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  // Construire le prompt avec contexte EEUEZ + historique
  let fullPrompt = `${EEUEZ_CONTEXT}

Tu es EEUEZ-Assist , l’assistant officiel de la plateforme www.eeuez.com

RÔLE :
Tu accompagnes les utilisateurs dans la découverte de la plateforme EEUEZ
et dans le développement de compétences utiles et monétisables
(Excel, WordPress, CapCut, outils EEUEZ, compétences digitales).

OBJECTIF :
- Comprendre le profil de l’utilisateur
- Identifier ses objectifs (emploi, business, études, productivité)
- Proposer un parcours de formation clair et personnalisé sur EEUEZ
- Guider étape par étape, comme un coach pédagogique
- a partir des informations de l'utlisateur, propose les outils de la plateforme qui pourront lui être utils
- assister l'utilisateur sur tout ses besoins sur la plateforme EEUEZ 

RÈGLES IMPORTANTES :
1. Tu te concentres principalement sur la plateforme EEUEZ et ses formations et outils disponible
2. Tu poses des questions simples et progressives pour mieux comprendre l’utilisateur
3. Tu proposes toujours des actions concrètes (quoi apprendre, pourquoi, comment)
4. Tu restes motivant, professionnel et bienveillant
5. Si une question est hors sujet, recentre poliment vers EEUEZ et l’apprentissage
6. Si une information n’est pas disponible, dis-le clairement sans inventer
7. Tu encourages l’autonomie et la progression continue de l’utilisateur
8. adapte toi automatiquement au niveau de l'utilisateur (débutant, intermédiaire, avancé), et à sa langue

STYLE DE RÉPONSE :
- Clair
- Structuré
- Orienté solutions
- Accessible aux débutants

Lors du premier message de l’utilisateur :
- Présente brièvement EEUEZ
- Explique que tu es un assistant/coach IA
- Pose 3 questions maximum pour comprendre son besoin
`;

  // Ajouter l'historique récent
  if (conversationHistory && conversationHistory.length > 0) {
    const recentHistory = conversationHistory.slice(-5);
    fullPrompt += '\nHistorique de conversation:\n';
    recentHistory.forEach(msg => {
      fullPrompt += `${msg.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}\n`;
    });
  }

  fullPrompt += `\nQuestion actuelle: ${userMessage}`;

  const requestBody = JSON.stringify({
    contents: [{
      parts: [{
        text: fullPrompt
      }]
    }]
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(apiUrl, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        
        if (response.candidates && response.candidates[0]) {
          const botMessage = response.candidates[0].content.parts[0].text;
          callback(null, botMessage);
        } else if (response.error) {
          callback(`Erreur API: ${response.error.message}`);
        } else {
          callback('Réponse inattendue de l\'API');
        }
      } catch (error) {
        callback('Erreur lors du traitement de la réponse');
      }
    });
  });

  req.on('error', error => callback(`Erreur réseau: ${error.message}`));
  req.write(requestBody);
  req.end();
}

// ==================== SERVEUR HTTP ====================

const server = http.createServer(async(req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // GET /auth/google
  if (req.method === 'GET' && pathname === '/auth/google') {
    if (!GOOGLE_CLIENT_ID) {
      res.writeHead(500, corsHeaders);
      res.end(JSON.stringify({ error: 'Google OAuth non configuré' }));
      return;
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=email profile&` +
      `access_type=offline`;

    res.writeHead(302, { 'Location': authUrl });
    res.end();
    return;
  }

  // GET /auth/google/callback
  if (req.method === 'GET' && pathname === '/auth/google/callback') {
    const code = parsedUrl.searchParams.get('code');
    
    if (!code) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ error: 'Code manquant' }));
      return;
    }

    exchangeCodeForToken(code, (err, tokens) => {
      if (err) {
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({ error: err.message }));
        return;
      }

      getUserInfo(tokens.access_token, (err, userInfo) => {
        if (err) {
          res.writeHead(500, corsHeaders);
          res.end(JSON.stringify({ error: err.message }));
          return;
        }

        const sessionId = generateSessionId();
        sessions.set(sessionId, {
          userId: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture
        });

        const frontendUrl = `http://localhost:${PORT}/frontend/chat.html?session=${sessionId}`;
        res.writeHead(302, { 'Location': frontendUrl });
        res.end();
      });
    });
    return;
  }

  // POST /api/chat
  if (req.method === 'POST' && pathname === '/api/chat') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const { message, sessionId } = JSON.parse(body);

        if (!message) {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({ error: 'Message requis' }));
          return;
        }

        let userId = 'anonymous';
        if (sessionId && sessions.has(sessionId)) {
          userId = sessions.get(sessionId).userId;
        }

        await saveConversationToDB(userId, message, 'user');
        const history = await getConversationHistory(userId);

        callGeminiAPI(message, history, async (error, botResponse) => {
          if (error) {
            res.writeHead(500, corsHeaders);
            res.end(JSON.stringify({ error }));
          } else {
            await saveConversationToDB(userId, botResponse, 'assistant');
            res.writeHead(200, corsHeaders);
            res.end(JSON.stringify({ response: botResponse }));
          }
        });

      } catch (error) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ error: 'JSON invalide' }));
      }
    });
    return;
  }

  // GET /api/history
  if (req.method === 'GET' && pathname === '/api/history') {
    const sessionId = parsedUrl.searchParams.get('sessionId');
    
    let userId = 'anonymous';
    if (sessionId && sessions.has(sessionId)) {
      userId = sessions.get(sessionId).userId;
    }

    const history = await getConversationHistory(userId);
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({ history }));
    return;
  }

  // DELETE /api/history
  if (req.method === 'DELETE' && pathname === '/api/history') {
    const sessionId = parsedUrl.searchParams.get('sessionId');
    
    let userId = 'anonymous';
    if (sessionId && sessions.has(sessionId)) {
      userId = sessions.get(sessionId).userId;
    }

    conversations.delete(userId);
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // GET /api/user
  if (req.method === 'GET' && pathname === '/api/user') {
    const sessionId = parsedUrl.searchParams.get('sessionId');
    
    if (sessionId && sessions.has(sessionId)) {
      const user = sessions.get(sessionId);
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({ user }));
    } else {
      res.writeHead(401, corsHeaders);
      res.end(JSON.stringify({ error: 'Non authentifié' }));
    }
    return;
  }

  // GET /health
  if (req.method === 'GET' && pathname === '/health') {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({ 
      status: 'ok', 
      message: 'Serveur EEUEZ-Assist actif',
      features: {
        gemini: !!GEMINI_API_KEY,
        mongodb: !!MONGODB_URI,
        oauth: !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET),
        webscraping: EEUEZ_CONTENT_LOADED
      }
    }));
    return;
  }

  // Servir les fichiers statiques
  if (req.method === 'GET' && pathname.startsWith('/frontend/')) {
    const filePath = path.join(__dirname, '..', pathname);
    serveStaticFile(filePath, res);
    return;
  }

  res.writeHead(404, corsHeaders);
  res.end(JSON.stringify({ error: 'Route non trouvée' }));
});

function generateSessionId() {
  return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function serveStaticFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Fichier non trouvé');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    }[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// Démarrer le serveur
server.listen(PORT, async () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     🚀 SERVEUR EEUEZ-ASSIST DÉMARRÉ                   ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`\n📍 URL: http://localhost:${PORT}`);
  
  // Charger le contenu EEUEZ
  await loadEEUEZContent();
  
  console.log(`\n✅ Fonctionnalités activées:`);
  console.log(`   ${GEMINI_API_KEY ? '✓' : '✗'} API Gemini`);
  console.log(`   ${MONGODB_URI ? '✓' : '✗'} MongoDB (sauvegarde)`);
  console.log(`   ${(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) ? '✓' : '✗'} Google OAuth`);
  console.log(`   ${EEUEZ_CONTENT_LOADED ? '✓' : '✗'} Lecture automatique de www.eeuez.com`);
  
  console.log(`\n📡 Endpoints API:`);
  console.log(`   - GET  /auth/google`);
  console.log(`   - POST /api/chat`);
  console.log(`   - GET  /api/history`);
  console.log(`   - GET  /health`);
  
  console.log(`\n🌐 Frontend: http://localhost:${PORT}/frontend/index.html\n`);

  await connectMongoDB();
});