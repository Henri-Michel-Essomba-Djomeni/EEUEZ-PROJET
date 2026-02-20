# 🤖 EEUEZ-Assist Chatbot

Assistant virtuel intelligent pour la plateforme EEUEZ, propulsé par Google Gemini AI.

## 📁 Structure du projet

```
eeuez-chatbot/
├── frontend/           # Interface utilisateur
│   ├── index.html     # Page de connexion
│   ├── chat.html      # Interface du chat
│   ├── script.js      # Logique frontend
│   └── style.css      # Styles CSS
├── backend/           # Serveur Node.js
│   ├── server.js      # API server
│   ├── .env           # Variables d'environnement (CLÉ API)
│   └── package.json   # Configuration Node.js
└── .gitignore         # Fichiers à ignorer par Git
```

---

## 🚀 Installation

### 1️⃣ Obtenir votre clé API Gemini

1. Allez sur https://aistudio.google.com/app/apikey
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Create API Key"**
4. Copiez la clé générée (commence par `AIza...`)

### 2️⃣ Configurer le backend

1. Ouvrez le fichier `backend/.env`
2. Remplacez `VOTRE_CLE_API_ICI` par votre vraie clé API :

```env
GEMINI_API_KEY=AIzaSy...VotreVraieCleIci
PORT=3000
```

⚠️ **IMPORTANT** : Ne partagez JAMAIS votre clé API et ne la commitez pas sur Git !

---

## 🎯 Lancement du projet

### Étape 1 : Démarrer le backend

Ouvrez un terminal dans le dossier `backend/` :

```bash
cd backend
node server.js
```

Vous devriez voir :
```
🚀 Serveur EEUEZ-Assist démarré sur http://localhost:3000
✅ API Gemini configurée
📡 Endpoints disponibles:
   - POST http://localhost:3000/api/chat
   - GET  http://localhost:3000/health
```

### Étape 2 : Ouvrir le frontend

1. Ouvrez le fichier `frontend/index.html` dans votre navigateur
2. Cliquez sur **"Se connecter"**
3. Commencez à discuter avec l'assistant ! 💬

---

## 🧪 Tester que tout fonctionne

### Test 1 : Vérifier le serveur

Dans un navigateur, allez sur : http://localhost:3000/health

Vous devriez voir :
```json
{"status":"ok","message":"Serveur EEUEZ-Assist actif"}
```

### Test 2 : Poser une question

Dans le chat, tapez :
```
C'est quoi EEUEZ ?
```

Le bot devrait répondre avec une réponse générée par Gemini AI !

---

## 🛠️ Fonctionnalités

✅ Interface de connexion moderne  
✅ Chat en temps réel  
✅ Intégration Google Gemini AI  
✅ Sécurisation de la clé API (backend)  
✅ Gestion des erreurs  
✅ Indicateur de chargement  
✅ Envoi de message avec Entrée  

---

## 🐛 Résolution de problèmes

### Erreur : "Impossible de se connecter au serveur"

- Vérifiez que le backend est démarré (`node server.js`)
- Vérifiez que le port 3000 est libre

### Erreur : "GEMINI_API_KEY non trouvée"

- Ouvrez `backend/.env`
- Vérifiez que votre clé API est bien écrite
- Redémarrez le serveur

### Le bot ne répond pas

- Vérifiez votre connexion internet
- Vérifiez que votre clé API Gemini est valide
- Regardez les logs du serveur dans le terminal

---

## 📝 API Endpoints

### POST /api/chat

Envoie un message au chatbot.

**Request:**
```json
{
  "message": "C'est quoi EEUEZ ?"
}
```

**Response:**
```json
{
  "response": "EEUEZ est une plateforme..."
}
```

### GET /health

Vérifie que le serveur fonctionne.

**Response:**
```json
{
  "status": "ok",
  "message": "Serveur EEUEZ-Assist actif"
}
```

---

## 🔒 Sécurité

- ✅ Clé API stockée dans `.env` (non partagée)
- ✅ `.gitignore` configuré pour protéger `.env`
- ✅ CORS activé pour le développement local
- ⚠️ Pour la production, configurez CORS correctement

---

## 🚀 Prochaines améliorations possibles

- [ ] Authentification utilisateur réelle
- [ ] Sauvegarde de l'historique des conversations
- [ ] Mode multi-utilisateurs
- [ ] Personnalisation du contexte EEUEZ
- [ ] Streaming des réponses (affichage progressif)
- [ ] Déploiement en production (Vercel, Heroku, etc.)

---

## 👥 Auteurs

Équipe EEUEZ - Hackathon G3

---

## 📄 Licence

ISC