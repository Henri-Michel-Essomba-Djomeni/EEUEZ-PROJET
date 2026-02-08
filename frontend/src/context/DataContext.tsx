
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_COURSES, MOCK_USERS, Course, User } from '../data/mockData';

interface DataContextType {
    courses: Course[];
    users: User[];
    addCourse: (course: Course) => void;
    deleteCourse: (id: string) => void;
    addUser: (user: User) => void;
    deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);

    const addCourse = (course: Course) => {
        setCourses(prev => [...prev, course]);
    };

    const deleteCourse = (id: string) => {
        setCourses(prev => prev.filter(c => c.id !== id));
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
