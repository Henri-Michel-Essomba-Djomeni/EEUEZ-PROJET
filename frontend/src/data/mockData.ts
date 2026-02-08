export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
}

export interface Lesson {
    id: string;
    title: string;
    duration: string;
    videoUrl: string;
    completed?: boolean;
}

export interface Quiz {
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
    instructorId: string;
    thumbnail: string;
    category: string;
    lessons: Lesson[];
    quizzes: Quiz[];
    enrolled?: boolean;
    rating?: number;
    // New fields for UI Redesign
    isLocked?: boolean;
    duration?: string;
    lessonsCount?: number;
    studentCount?: number;
    level?: 'Débutant' | 'Intermédiaire' | 'Avancé';
}

export const MOCK_USERS: User[] = [
    { id: '1', name: 'Joseph Heneg', email: 'admin@elearn.com', role: 'ADMIN' },
    { id: '2', name: 'Prof. Jean Dupont', email: 'jean@elearn.com', role: 'TEACHER' },
    { id: '3', name: 'Alice Smith', email: 'alice@student.com', role: 'STUDENT' },
];

export const MOCK_COURSES: Course[] = [
    {
        id: 'c1',
        title: 'Fondamentaux WordPress',
        description: 'Créez et gérez vos sites web professionnels sans coder.',
        instructor: 'Joseph Heneg',
        instructorId: '1',
        thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=800',
        category: 'Développement Web',
        lessons: [],
        quizzes: [],
        enrolled: true,
        rating: 4.8,
        isLocked: false,
        duration: '10 heures',
        lessonsCount: 28,
        studentCount: 1534,
        level: 'Intermédiaire'
    },
    {
        id: 'c2',
        title: 'Initiation aux Outils EEUEZ',
        description: 'Découvrez et exploitez tout le potentiel des outils de la plateforme EEUEZ.',
        instructor: 'Marie Lopez',
        instructorId: '4',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
        category: 'Productivité',
        lessons: [],
        quizzes: [],
        rating: 4.5,
        isLocked: false,
        duration: '6 heures',
        lessonsCount: 18,
        studentCount: 3421,
        level: 'Débutant'
    },
    {
        id: 'c3',
        title: 'Initiation au Montage CapCut',
        description: 'Créez des vidéos professionnelles avec l\'outil de montage CapCut.',
        instructor: 'Paul Martin',
        instructorId: '5',
        thumbnail: 'https://images.unsplash.com/photo-1574717436059-4a96befd2674?q=80&w=800',
        category: 'Design',
        lessons: [],
        quizzes: [],
        isLocked: false,
        duration: '8 heures',
        lessonsCount: 24,
        studentCount: 1876,
        level: 'Débutant'
    },
    {
        id: 'c4',
        title: 'Sécurité Informatique',
        description: 'Apprenez les fondamentaux de la cybersécurité et protégez vos données.',
        instructor: 'Sarah Connor',
        instructorId: '6',
        thumbnail: 'https://images.unsplash.com/photo-1550751817-1f2e23d6bb50?q=80&w=800',
        category: 'Sécurité',
        lessons: [],
        quizzes: [],
        isLocked: true,
        duration: '10 heures',
        lessonsCount: 32,
        studentCount: 892,
        level: 'Débutant'
    },
    {
        id: 'c5',
        title: 'Bases de Données',
        description: 'Maîtrisez les concepts de bases de données et le langage SQL.',
        instructor: 'Alan Turing',
        instructorId: '7',
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800',
        category: 'Data',
        lessons: [],
        quizzes: [],
        isLocked: true,
        duration: '12 heures',
        lessonsCount: 36,
        studentCount: 756,
        level: 'Intermédiaire'
    },
    {
        id: 'c6',
        title: 'Réseaux Informatiques',
        description: 'Comprenez l\'architecture et le fonctionnement des réseaux.',
        instructor: 'Grace Hopper',
        instructorId: '8',
        thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800',
        category: 'Réseaux',
        lessons: [],
        quizzes: [],
        isLocked: true,
        duration: '15 heures',
        lessonsCount: 42,
        studentCount: 534,
        level: 'Avancé'
    }
];
