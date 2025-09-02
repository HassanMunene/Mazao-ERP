import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';
import { api } from '@/lib/api';
import Cookies from 'js-cookie';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = Cookies.get('jwt');
            if (token) {
                const response = await api.get('/auth/me');
                setUser(response.data);
            }
        } catch (error) {
            Cookies.remove('jwt');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        setUser(response.data.user);
    };

    const register = async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        setUser(response.data.user);
    };

    const logout = () => {
        Cookies.remove('jwt');
        setUser(null);
        api.post('/auth/logout');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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