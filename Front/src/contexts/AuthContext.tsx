// src/contexts/AuthContext.tsx

import { createContext, useContext } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    user: { id: string; email: string; role: string } | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, username: string, password: string) => Promise<void>;
    deleteAccount: () => Promise<void>;
    refreshAccessToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
