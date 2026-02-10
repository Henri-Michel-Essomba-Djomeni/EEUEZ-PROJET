
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, User } from '../data/mockData';

interface DataContextType {
    courses: Course[];
    users: User[];
    addCourse: (course: Course) => void;
    deleteCourse: (id: string) => void;
    addUser: (user: User) => void;
    deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

import { coursesAPI } from '../services/api';

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesData = await coursesAPI.getAllCourses();
                // Map API response to Course interface if needed, for now assuming match
                const mappedCourses: Course[] = coursesData.map((c: any) => ({
                    ...c,
                    id: c.id.toString(), // Ensure ID is string as per frontend type
                    instructorId: c.instructor_id?.toString(),
                    lessonsCount: 0, // Mock for now or fetch
                    studentCount: 0, // Mock for now or fetch
                    isLocked: !!c.is_locked,
                    instructor: "Instructor Name" // You might need to fetch this or join in backend
                }));
                // For users, usually only admin fetches all users. 
                // We'll leave it empty or fetch if role is admin (needs auth context)

                setCourses(mappedCourses);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const addCourse = async (course: Course) => {
        // Optimistic update or wait for API
        try {
            const newCourse = await coursesAPI.createCourse(course);
            setCourses(prev => [...prev, { ...newCourse, id: newCourse.id.toString() }]);
        } catch (error) {
            console.error("Failed to add course", error);
        }
    };

    const deleteCourse = (id: string) => {
        setCourses(prev => prev.filter(c => c.id !== id));
        // Todo: call API to delete
    };

    const addUser = (user: User) => {
        setUsers(prev => [...prev, user]);
    };

    const deleteUser = (id: string) => {
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    return (
        <DataContext.Provider value={{ courses, users, addCourse, deleteCourse, addUser, deleteUser }}>
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
