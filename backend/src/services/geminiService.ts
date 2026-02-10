import https from 'https';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EEUEZ_WEBSITE = 'https://www.eeuez.com';

let EEUEZ_CONTEXT = '';
let EEUEZ_CONTENT_LOADED = false;

// Charger le contexte personnalisé
const contextPath = path.join(process.cwd(), 'eeuez-context.txt');
let customContext = '';
if (fs.existsSync(contextPath)) {
    customContext = fs.readFileSync(contextPath, 'utf-8');
    console.log('✅ Fichier eeuez-context.txt chargé');
}

function fetchWebContent(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', (err) => reject(err));
    });
}

function extractTextFromHTML(html: string): string {
    let text = html;
    text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    text = text.replace(/<[^>]+>/g, ' ');
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/\s+/g, ' ');
    text = text.replace(/\n\s*\n/g, '\n');
    return text.trim();
}

export async function loadEEUEZContent() {
    console.log('📡 Chargement du contenu du site EEUEZ...');
    try {
        const html = await fetchWebContent(EEUEZ_WEBSITE);
        const textContent = extractTextFromHTML(html);
        const maxLength = 4000;
        const truncatedContent = textContent.substring(0, maxLength);

        EEUEZ_CONTEXT = `
=== INFORMATIONS OFFICIELLES DU SITE EEUEZ (www.eeuez.com) ===

${truncatedContent}

=== INFORMATIONS COMPLÉMENTAIRES ===

${customContext}

=== FIN DU CONTEXTE ===
`;
        EEUEZ_CONTENT_LOADED = true;
        console.log('✅ Contenu du site EEUEZ chargé avec succès');
        return true;
    } catch (err) {
        console.error('❌ Erreur lors du chargement du site EEUEZ:', (err as Error).message);
        EEUEZ_CONTEXT = customContext || 'EEUEZ est une plateforme éducative.';
        return false;
    }
}

export function callGeminiAPI(userMessage: string, conversationHistory: any[]): Promise<string> {
    return new Promise((resolve, reject) => {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

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

        const req = https.request(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.candidates && response.candidates[0]) {
                        resolve(response.candidates[0].content.parts[0].text);
                    } else if (response.error) {
                        reject(`Erreur API: ${response.error.message}`);
                    } else {
                        reject('Réponse inattendue de l\'API');
                    }
                } catch (error) {
                    reject('Erreur lors du traitement de la réponse');
                }
            });
        });

        req.on('error', error => reject(`Erreur réseau: ${error.message}`));
        req.write(requestBody);
        req.end();
    });
}
