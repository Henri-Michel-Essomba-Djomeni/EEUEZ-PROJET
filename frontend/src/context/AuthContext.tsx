import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role, User, MOCK_USERS } from '../data/mockData';

interface AuthContextType {
    user: User | null;
    role: Role;
    setRole: (role: Role) => void;
    login: (email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRoleState] = useState<Role>('STUDENT');
    const [user, setUser] = useState<User | null>(null); // Start as null

    const setRole = (newRole: Role) => {
        setRoleState(newRole);
        if (user) {
            const mockUser = MOCK_USERS.find(u => u.role === newRole) || MOCK_USERS[2];
            setUser(mockUser);
        }
    };

    const login = (email: string) => {
        // Basic simulation: find a user by role based on email hint
        let defaultRole: Role = 'STUDENT';
        if (email.includes('admin')) defaultRole = 'ADMIN';
        else if (email.includes('teacher') || email.includes('jean')) defaultRole = 'TEACHER';

        setRoleState(defaultRole);
        const mockUser = MOCK_USERS.find(u => u.role === defaultRole) || MOCK_USERS[2];
        setUser(mockUser);
    };

    const logout = () => {
        setUser(null);
        setRoleState('STUDENT');
    };

    return (
        <AuthContext.Provider value={{ user, role, setRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
