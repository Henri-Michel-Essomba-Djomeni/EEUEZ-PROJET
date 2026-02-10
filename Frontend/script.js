const API_URL = 'http://localhost:3000';
let currentSessionId = null;

// ==================== AUTHENTIFICATION ====================

function loginWithGoogle() {
  // Rediriger vers l'endpoint OAuth du backend
  window.location.href = `${API_URL}/auth/google`;
}

function loginClassic() {
  alert('Connexion classique non disponible pour l\'instant. Utilisez Google OAuth.');
}

function goChat() {
  // Cette fonction n'est plus utilisée directement
  // La redirection se fait via OAuth
}

function logout() {
  if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
    localStorage.removeItem('sessionId');
    window.location.href = 'index.html';
  }
}

// Récupérer le sessionId depuis l'URL ou localStorage
function getSessionId() {
  if (currentSessionId) return currentSessionId;

  // D'abord vérifier l'URL (après OAuth callback)
  const urlParams = new URLSearchParams(window.location.search);
  const sessionFromUrl = urlParams.get('session');
  
  if (sessionFromUrl) {
    currentSessionId = sessionFromUrl;
    localStorage.setItem('sessionId', sessionFromUrl);
    // Nettoyer l'URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return sessionFromUrl;
  }

  // Sinon vérifier localStorage
  const sessionFromStorage = localStorage.getItem('sessionId');
  if (sessionFromStorage) {
    currentSessionId = sessionFromStorage;
    return sessionFromStorage;
  }

  return null;
}

// Vérifier l'authentification
async function checkAuth() {
  const sessionId = getSessionId();
  
  if (!sessionId) {
    // Non authentifié, rediriger vers login
    if (window.location.pathname.includes('chat.html')) {
      window.location.href = 'index.html';
    }
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/api/user?sessionId=${sessionId}`);
    const data = await response.json();

    if (response.ok && data.user) {
      // Afficher les infos utilisateur
      displayUserInfo(data.user);
      return true;
    } else {
      // Session invalide
      localStorage.removeItem('sessionId');
      if (window.location.pathname.includes('chat.html')) {
        window.location.href = 'index.html';
      }
      return false;
    }
  } catch (error) {
    console.error('Erreur vérification auth:', error);
    return false;
  }
}

function displayUserInfo(user) {
  const userNameEl = document.getElementById('userName');
  const userEmailEl = document.getElementById('userEmail');
  const userAvatarEl = document.getElementById('userAvatar');

  if (userNameEl) userNameEl.textContent = user.name || 'Utilisateur';
  if (userEmailEl) userEmailEl.textContent = user.email || '';
  
  if (userAvatarEl && user.picture) {
    userAvatarEl.innerHTML = `<img src="${user.picture}" alt="Avatar" style="width: 40px; height: 40px; border-radius: 50%;">`;
  }
}

// ==================== CHAT ====================

async function sendMessage() {
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const text = input.value.trim();
  
  if (!text) return;

  const sessionId = getSessionId();

  // Afficher le message utilisateur
  addMessage(text, "user");
  input.value = "";
  
  // Désactiver le bouton
  sendBtn.disabled = true;
  sendBtn.style.opacity = "0.5";

  // Message de chargement
  const loadingMsg = addMessage("⏳ Analyse en cours...", "bot");

  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: text,
        sessionId: sessionId
      })
    });

    const data = await response.json();

    // Supprimer le message de chargement
    loadingMsg.remove();

    if (response.ok) {
      // Afficher la réponse du bot
      addMessage(data.response, "bot");
      
      // Rafraîchir l'historique
      loadHistory();
    } else {
      addMessage(`❌ Erreur: ${data.error || 'Erreur inconnue'}`, "bot");
    }

  } catch (error) {
    loadingMsg.remove();
    addMessage("❌ Impossible de se connecter au serveur. Vérifiez que le backend est démarré.", "bot");
    console.error('Erreur:', error);
  } finally {
    sendBtn.disabled = false;
    sendBtn.style.opacity = "1";
  }
}

function addMessage(text, type) {
  const messages = document.getElementById("messages");
  const div = document.createElement("div");
  div.className = type;
  
  // Formatage du texte (support basique du markdown)
  const formattedText = formatMessage(text);
  div.innerHTML = formattedText;
  
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  
  return div;
}

function formatMessage(text) {
  // Remplacer **texte** par <strong>texte</strong>
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Remplacer les retours à la ligne par <br>
  text = text.replace(/\n/g, '<br>');
  
  return text;
}

// ==================== HISTORIQUE ====================

async function loadHistory() {
  const sessionId = getSessionId();
  if (!sessionId) return;

  try {
    const response = await fetch(`${API_URL}/api/history?sessionId=${sessionId}`);
    const data = await response.json();

    if (response.ok && data.history) {
      displayHistory(data.history);
    }
  } catch (error) {
    console.error('Erreur chargement historique:', error);
  }
}

function displayHistory(history) {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;

  if (history.length === 0) {
    historyList.innerHTML = '<p style="font-size: 12px; opacity: 0.7;">Aucune conversation</p>';
    return;
  }

  // Afficher les 5 derniers messages utilisateur
  const userMessages = history.filter(msg => msg.role === 'user').slice(-5).reverse();
  
  historyList.innerHTML = userMessages.map(msg => {
    const preview = msg.content.substring(0, 40) + (msg.content.length > 40 ? '...' : '');
    const time = new Date(msg.timestamp).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return `<p title="${msg.content}">💬 ${preview}<br><small>${time}</small></p>`;
  }).join('');
}

async function clearHistory() {
  if (!confirm('Voulez-vous vraiment effacer tout l\'historique ?')) {
    return;
  }

  const sessionId = getSessionId();
  if (!sessionId) return;

  try {
    const response = await fetch(`${API_URL}/api/history?sessionId=${sessionId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      // Vider l'affichage
      const messages = document.getElementById("messages");
      messages.innerHTML = '<div class="bot">👋 Posez-moi n\'importe quelle question sur la plateforme EEUEZ</div>';
      
      // Rafraîchir l'historique
      loadHistory();
      
      alert('✅ Historique effacé');
    }
  } catch (error) {
    console.error('Erreur suppression historique:', error);
    alert('❌ Erreur lors de la suppression');
  }
}

function newConversation() {
  if (confirm('Commencer une nouvelle conversation ? (L\'historique actuel sera conservé)')) {
    const messages = document.getElementById("messages");
    messages.innerHTML = '<div class="bot">👋 Nouvelle conversation ! Posez-moi vos questions sur EEUEZ.</div>';
  }
}

// ==================== ÉVÉNEMENTS ====================

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById("userInput");
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
});