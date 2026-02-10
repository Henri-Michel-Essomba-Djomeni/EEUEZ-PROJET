# EEUEZ ACADEMY - Plateforme de Formation en Ligne

Bienvenue sur la plateforme EEUEZ Academy, une application web moderne pour la formation en ligne, la gestion de cours et de certifications.

## 🚀 Fonctionnalités Principal

- **Catalogue de Cours**: Exploration de formations par catégories et niveaux.
- **Gestionnaire d'Apprentissage**: Tableau de bord pour suivre la progression.
- **Certification**: Génération automatique de certificats de réussite.
- **Interface Premium**: Design moderne avec Shadcn UI et Framer Motion.
- **Administration**: Gestion des utilisateurs et des contenus par les administrateurs et professeurs.

## 🛠 Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- **Node.js** (v18 ou supérieur)
- **npm** (v9 ou supérieur)
- **MySQL** (v8 ou supérieur)

## 📂 Structure du Projet

```text
EEUEZ-PROJET/
├── backend/          # Serveur API Node.js/Express
└── frontend/         # Application React/Vite
```

## ⚙️ Installation

### 1. Cloner le projet
```bash
git clone https://github.com/Henri-Michel-Essomba-Djomeni/EEUEZ-PROJET.git
cd EEUEZ-PROJET
```

### 2. Configuration de la Base de Données
1. Créez une base de données MySQL nommée `eeuez_academy` (ou le nom de votre choix).
2. Configurez les variables d'environnement dans `backend/.env`.

### 3. Backend (Serveur)
```bash
cd backend
npm install
```
Créez un fichier `.env` dans le dossier `backend/` :
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=eeuez_academy
JWT_SECRET=votre_secret_tres_long_et_securise
```

### 4. Frontend (Client)
```bash
cd ../frontend
npm install
```
Créez un fichier `.env` dans le dossier `frontend/` :
```env
VITE_API_URL=http://localhost:3000/api
```

## 🚀 Lancement

### Initialisation de la Base de Données
Dans le dossier `backend/`, exécutez ces commandes dans l'ordre :
1. **Migration** (Création des tables) :
   ```bash
   npm run migrate
   ```
2. **Seeding** (Population des données initiales) :
   ```bash
   npm run seed
   ```

### Démarrage des serveurs
Ouvrez deux terminaux différents :

**Terminal 1 (Backend) :**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend) :**
```bash
cd frontend
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

## 🔑 Identifiants par défaut (après Seeding)

Tous les comptes utilisent le mot de passe : `Password123!`

| Rôle | Email |
| :--- | :--- |
| **Admin** | `admin@eeuez.com` |
| **Professeur** | `jean.teacher@eeuez.com` |
| **Étudiant** | `alice@student.com` |

## 🧪 Technologies Utilisées

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, MySQL, JWT, Bcrypt.

---
© 2026 EEUEZ ACADEMY. Tous droits réservés.
