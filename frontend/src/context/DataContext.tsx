import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, User } from '../types';
import { coursesAPI, authAPI, certificationsAPI } from '../services/api';

interface DataContextType {
    courses: Course[];
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    refreshData: () => Promise<void>;
    isLoading: boolean;
    updateUser: (userData: User) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const refreshData = async () => {
        try {
            const coursesData = await coursesAPI.getAllCourses();
            // Map backend data to frontend Course interface if necessary
            // The backend return structure should now match strict types or be adapted here
            const mappedCourses = coursesData.map((c: any) => ({
                id: c.id.toString(),
                title: c.title,
                description: c.description,
                category: c.category,
                level: c.level,
                thumbnail: c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', // Default if missing
                duration: c.duration || '0h',
                price: c.price || 0,
                instructorId: c.instructor_id?.toString(),
                lessons: c.lessons || [], // Ensure lessons is an array
                quizzes: c.quizzes || [], // Ensure quizzes is an array
                lessonsCount: c.lessons?.length || 0,
                studentCount: c.student_count || 0, // Backend should return this or we mock/fetch
                is_locked: !!c.is_locked,
                instructor: c.instructor_name || "Unknown Instructor", // Join in backend
                rating: c.rating || 0
            }));
            setCourses(mappedCourses);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        }
    };

    const checkAuth = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const userData = await authAPI.getCurrentUser();
                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem('authToken');
                setIsAuthenticated(false);
                setUser(null);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        checkAuth();
        refreshData();
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('authToken', token);
        setUser(userData);
        setIsAuthenticated(true);
        refreshData(); // Refresh data after login to see enrolled courses etc.
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (userData: User) => {
        setUser(userData);
    };

    return (
        <DataContext.Provider value={{ courses, user, isAuthenticated, login, logout, refreshData, isLoading, updateUser }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
