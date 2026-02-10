import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, storage } from '../services/api';
import { User, Role } from '../types';

interface AuthContextType {
    user: User | null;
    role: Role;
    setRole: (role: Role) => void;
    login: (email: string, password?: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRoleState] = useState<Role>('STUDENT');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = storage.getToken();
            if (token) {
                try {
                    const userData = await authAPI.getCurrentUser();
                    // map backend user to frontend user interface if needed
                    const mappedUser: User = {
                        id: userData.id.toString(),
                        name: userData.name,
                        email: userData.email,
                        role: userData.role,
                        avatar: userData.avatar
                    };
                    setUser(mappedUser);
                    setRoleState(userData.role);
                } catch (error) {
                    console.error('Failed to strict user', error);
                    storage.clear();
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const setRole = (newRole: Role) => {
        // Only for development/demo purposes or admin override
        setRoleState(newRole);
    };

    const login = async (email: string, password?: string) => {
        try {
            // If password is provided, use real API
            if (password) {
                const response = await authAPI.login(email, password);
                storage.setToken(response.token);

                const mappedUser: User = {
                    id: response.user.id.toString(),
                    name: response.user.name,
                    email: response.user.email,
                    role: response.user.role,
                    avatar: response.user.avatar
                };

                setUser(mappedUser);
                setRoleState(response.user.role);
            } else {
                // Fallback for existing demo buttons that don't pass password
                console.warn("Using demo login without password. This should be updated.");
                // You might want to remove this branch eventually
            }
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const logout = () => {
        storage.clear();
        setUser(null);
        setRoleState('STUDENT');
    };

    return (
        <AuthContext.Provider value={{
            user,
            role,
            setRole,
            login,
            logout,
            isAuthenticated: !!user,
            isLoading
        }}>
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
