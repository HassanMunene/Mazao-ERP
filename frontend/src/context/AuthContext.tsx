import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const JWT_TOKEN_KEY = 'jwt_token';
const USER_DATA_KEY = 'user_data';

// Simple localStorage helper
const storage = {
    set: (key: string, value: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('LocalStorage set failed:', error);
        }
    },

    get: (key: string): any => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.warn('LocalStorage get failed:', error);
            return null;
        }
    },

    remove: (key: string) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('LocalStorage remove failed:', error);
        }
    },

    clear: () => {
        try {
            localStorage.removeItem(JWT_TOKEN_KEY);
            localStorage.removeItem(USER_DATA_KEY);
        } catch (error) {
            console.warn('LocalStorage clear failed:', error);
        }
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = storage.get(JWT_TOKEN_KEY);
            const savedUser = storage.get(USER_DATA_KEY);

            if (token && savedUser) {
                // Set the authorization header for all future requests
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Verify token is still valid with backend
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                    // Update stored user data with fresh data from server
                    storage.set(USER_DATA_KEY, response.data);
                } catch (error) {
                    console.warn('Token validation failed, using stored data:', error);
                    // Use stored user data if validation fails (offline support)
                    setUser(savedUser);
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            handleAuthFailure();
        } finally {
            setLoading(false);
        }
    };

    const handleAuthFailure = () => {
        storage.clear();
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { user: userData, token } = response.data;

            // Store token and user data in localStorage
            storage.set(JWT_TOKEN_KEY, token);
            storage.set(USER_DATA_KEY, userData);

            // Set authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(userData);
        } catch (error: any) {
            console.error('Login failed:', error);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (userData: any) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { user: newUser, token } = response.data;

            // Store token and user data in localStorage
            storage.set(JWT_TOKEN_KEY, token);
            storage.set(USER_DATA_KEY, newUser);

            // Set authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(newUser);
        } catch (error: any) {
            console.error('Registration failed:', error);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.warn('Logout API call failed:', error);
        } finally {
            // Always clear local state regardless of API call success
            handleAuthFailure();
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
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