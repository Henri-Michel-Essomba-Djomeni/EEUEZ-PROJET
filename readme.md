# 🎓 EEUEZ - Plateforme d'Apprentissage en Ligne

Plateforme complète d'apprentissage en ligne avec inscription aux cours, suivi de progression, évaluations interactives et système d'abonnement.

## 🏗️ Architecture

- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** Node.js + Express + TypeScript
- **Base de données:** MongoDB + Mongoose
- **Authentification:** JWT (JSON Web Tokens)

## 📁 Structure du Projet

```
EEUEZ-PROJET/
├── frontend/           # Application React
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── services/    # API et services
│   │   └── ...
│   └── package.json
├── backend/            # API Express
│   ├── src/
│   │   ├── controllers/ # Logique métier
│   │   ├── models/      # Modèles MongoDB
│   │   ├── routes/      # Routes API
│   │   └── ...
│   └── package.json
└── README.md
```

## 🚀 Installation Rapide

### Prérequis

- **Node.js** v18+ ([Télécharger](https://nodejs.org/))
- **MongoDB** v5+ ([Télécharger](https://www.mongodb.com/try/download/community))
- **npm** ou **yarn**

### 1️⃣ Installer MongoDB

#### Windows
```powershell
# Télécharger et installer MongoDB Community Server
# https://www.mongodb.com/try/download/community

# Ou avec Chocolatey
choco install mongodb

# Démarrer MongoDB
mongod
```

#### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2️⃣ Installation du Backend

```bash
# Naviguer vers le dossier backend
cd backend

# Installer les dépendances
npm install

# Le fichier .env est déjà configuré avec les valeurs par défaut
# Si nécessaire, vous pouvez le modifier

# Initialiser la base de données avec des données de test
npm run seed
```

### 3️⃣ Installation du Frontend

```bash
# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Le fichier .env est déjà créé
```

## 🎬 Démarrage de l'Application

Vous aurez besoin de **3 terminaux** :

### Terminal 1️⃣ : MongoDB
```bash
mongod
```

### Terminal 2️⃣ : Backend
```bash
cd backend
npm run dev
```
Le backend démarrera sur `http://localhost:5000`

### Terminal 3️⃣ : Frontend
```bash
cd frontend
npm run dev
```
Le frontend démarrera sur `http://localhost:5173`

## 👥 Comptes de Test

Après avoir exécuté `npm run seed`, vous pouvez utiliser ces comptes :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Professeur | teacher@eeuez.com | password123 |
| Étudiant 1 | student1@eeuez.com | password123 |
| Étudiant 2 | student2@eeuez.com | password123 |

## 🎯 Fonctionnalités

### Pour les Étudiants
- ✅ Inscription et connexion sécurisées
- ✅ Navigation et recherche de cours
- ✅ Inscription aux cours
- ✅ Suivi de progression par cours
- ✅ Évaluations interactives avec score
- ✅ Système d'abonnement (Free, Basic, Premium, Enterprise)
- ✅ Dashboard personnalisé
- ✅ Notation et commentaires sur les cours

### Pour les Professeurs
- ✅ Création et gestion de cours
- ✅ Organisation en modules
- ✅ Création d'évaluations (quiz/examens)
- ✅ Suivi des étudiants inscrits
- ✅ Statistiques des cours

### Fonctionnalités Techniques
- ✅ Base de données MongoDB
- ✅ API RESTful
- ✅ Authentification JWT
- ✅ Hachage des mots de passe (bcrypt)
- ✅ Validation des données
- ✅ Gestion des erreurs
- ✅ CORS configuré
- ✅ Design responsive
- ✅ Mode sombre/clair

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Profil utilisateur
- `PUT /api/auth/subscription` - Mettre à jour l'abonnement

### Courses
- `GET /api/courses` - Liste des cours
- `GET /api/courses/:id` - Détails d'un cours
- `POST /api/courses` - Créer un cours (professeur)
- `PUT /api/courses/:id` - Modifier un cours (professeur)
- `POST /api/courses/:id/enroll` - S'inscrire à un cours
- `GET /api/courses/enrolled/my-courses` - Mes cours
- `POST /api/courses/:id/rating` - Noter un cours

### Progress
- `GET /api/progress/all` - Toute ma progression
- `GET /api/progress/:courseId` - Progression d'un cours
- `PUT /api/progress/:courseId/module` - Compléter un module
- `POST /api/progress/:courseId/evaluation` - Soumettre une évaluation

Voir [backend/README.md](./backend/README.md) pour plus de détails.

## 🗄️ Modèles de Données MongoDB

### User
```typescript
{
  email: string;
  password: string;  // Haché avec bcrypt
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
  subscriptionPlan: 'free' | 'basic' | 'premium' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'pending';
  enrolledCourses: ObjectId[];
}
```

### Course
```typescript
{
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: ObjectId;
  price: number;
  duration: number;
  modules: [{
    title: string;
    description: string;
    duration: number;
    videoUrl?: string;
    resources: string[];
    order: number;
  }];
  evaluation?: {
    type: 'quiz' | 'exam' | 'assignment';
    questions: [{
      question: string;
      options: string[];
      correctAnswer: number;
      points: number;
    }];
    passingScore: number;
  };
  enrolledStudents: ObjectId[];
  ratings: [{
    user: ObjectId;
    rating: number;
    comment?: string;
  }];
  averageRating: number;
  isPublished: boolean;
}
```

### Progress
```typescript
{
  user: ObjectId;
  course: ObjectId;
  completedModules: number[];
  currentModule: number;
  progressPercentage: number;
  lastAccessed: Date;
  timeSpent: number;
  evaluationResults?: {
    score: number;
    maxScore: number;
    percentage: number;
    status: 'passed' | 'failed' | 'pending';
    answers: [{
      questionIndex: number;
      selectedAnswer: number;
      isCorrect: boolean;
    }];
  };
}
```

## 🛠️ Scripts Disponibles

### Backend
```bash
npm run dev      # Démarrer en mode développement
npm run build    # Compiler TypeScript
npm start        # Démarrer en production
npm run seed     # Initialiser la base de données
```

### Frontend
```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Créer le build de production
npm run preview  # Prévisualiser le build
```

## 🔧 Configuration

### Variables d'Environnement Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eeuez
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Variables d'Environnement Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Tests de l'API

### Avec curl
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@eeuez.com","password":"password123"}'

# Liste des cours
curl http://localhost:5000/api/courses

# Health check
curl http://localhost:5000/api/health
```

### Avec Postman ou Insomnia
1. Créer une collection avec les endpoints
2. Se connecter pour obtenir un token JWT
3. Ajouter le token dans les headers: `Authorization: Bearer <token>`

## 🐛 Dépannage

### MongoDB ne démarre pas
```bash
# Vérifier l'installation
mongod --version

# Vérifier si MongoDB est en cours d'exécution
# Windows
tasklist | findstr mongod

# macOS/Linux
ps aux | grep mongod
```

### Le backend ne se connecte pas à MongoDB
1. Vérifier que MongoDB est démarré
2. Vérifier `MONGODB_URI` dans `.env`
3. Tester la connexion : `mongosh mongodb://localhost:27017`

### CORS errors
- Vérifier que `FRONTEND_URL` dans le backend `.env` correspond à l'URL du frontend
- Le frontend doit tourner sur `http://localhost:5173`

### Les modules TypeScript ne sont pas trouvés
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📱 Captures d'Écran

[À ajouter : captures d'écran de l'application]

## 🚀 Déploiement

### Backend (Production)
1. Utiliser MongoDB Atlas ou un serveur MongoDB
2. Mettre à jour `MONGODB_URI` avec l'URL de production
3. Changer `JWT_SECRET` pour une clé sécurisée
4. Compiler : `npm run build`
5. Démarrer : `npm start`

### Frontend (Production)
1. Mettre à jour `VITE_API_URL` avec l'URL de l'API de production
2. Compiler : `npm run build`
3. Déployer le dossier `dist/` sur un serveur web ou Vercel/Netlify

## 🔐 Sécurité

- ✅ Mots de passe hachés avec bcrypt (10 salt rounds)
- ✅ Authentification JWT
- ✅ CORS configuré
- ✅ Variables d'environnement pour les secrets
- ✅ Validation des données côté serveur
- ⚠️ **Important:** Changez `JWT_SECRET` en production !

## 📖 Documentation Supplémentaire

- [Backend README](./backend/README.md) - Documentation détaillée de l'API
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Express Documentation](https://expressjs.com/)

## 🎓 Cours de Test Disponibles

Après le seeding, 3 cours sont disponibles :
1. **Introduction à JavaScript** (Débutant, Programmation)
2. **React pour débutants** (Intermédiaire, Développement Web)
3. **MongoDB et Base de Données NoSQL** (Intermédiaire, Base de Données)

## 🤝 Contribution

Ce projet est un projet éducatif. Pour contribuer :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

ISC

## 👨‍💻 Support

Pour toute question ou problème :
- Vérifier les README dans `/backend` et `/frontend`
- Consulter les logs du serveur
- Vérifier les logs MongoDB

## 🎉 Prochaines Fonctionnalités

- [ ] Notifications en temps réel
- [ ] Chat entre étudiants et professeurs
- [ ] Certificats de fin de cours
- [ ] Système de badges
- [ ] Analytics avancés pour les professeurs
- [ ] Paiements en ligne (Stripe)
- [ ] Vidéos en streaming
- [ ] Téléchargement de ressources
- [ ] Forum de discussion
- [ ] Application mobile (React Native)

---

**Développé avec ❤️ pour l'apprentissage en ligne**
