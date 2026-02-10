export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
    subscription_plan?: string;
}

export interface Lesson {
    id: string;
    course_id?: string;
    title: string;
    description?: string;
    content?: string;
    video_url?: string;
    duration: string;
    order_index: number;
    completed?: boolean;
}

export interface QuestionOption {
    id?: string;
    option_text: string;
    is_correct?: boolean;
}

export interface QuizQuestion {
    id: string;
    question_text: string;
    options: string[]; // For frontend display
    correctAnswer: number; // Index of correct answer
    points?: number;
}

export interface Quiz {
    id: string;
    title: string;
    description?: string;
    questions: QuizQuestion[];
    passing_score?: number;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    instructorId: string;
    instructor?: string; // Name
    thumbnail: string;
    category: string;
    level: 'Débutant' | 'Intermédiaire' | 'Avancé';
    duration: string;
    is_locked: boolean;
    price?: number;
    created_at?: string;
    updated_at?: string;

    // Relations
    lessons: Lesson[];
    quizzes: Quiz[];

    // Computed/User specific
    enrolled?: boolean;
    completed?: boolean;
    rating?: number;
    lessonsCount?: number;
    studentCount?: number;
}

export interface Certification {
    id: string;
    user_id: string;
    course_id: string;
    courseTitle: string;
    certificate_code: string;
    issue_date: string;
    score: number;
    instructor?: string;
}
