import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// NOTE: This is a simple, non-secure authentication system using localStorage.
// Do not use this for production applications with sensitive data.

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<void>;
  logIn: (email: string, pass: string) => Promise<void>;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'shutter_sync_users';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const loggedInUserEmail = sessionStorage.getItem('currentUser');
            if (loggedInUserEmail) {
                setUser({ email: loggedInUserEmail });
            }
        } catch (error) {
            console.error("Failed to read user from session storage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const getUsers = () => {
        try {
            const users = localStorage.getItem(USERS_STORAGE_KEY);
            return users ? JSON.parse(users) : {};
        } catch (error) {
            console.error("Failed to read users from local storage", error);
            return {};
        }
    };
    
    const saveUsers = (users: object) => {
        try {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        } catch (error) {
            console.error("Failed to save users to local storage", error);
        }
    };

    const signUp = (email: string, password: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const users = getUsers();
            if (users[email]) {
                return reject(new Error('This email address is already in use.'));
            }
            users[email] = password; // Storing password directly - NOT SECURE
            saveUsers(users);
            sessionStorage.setItem('currentUser', email);
            setUser({ email });
            resolve();
        });
    };

    const logIn = (email: string, password: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const users = getUsers();
            if (!users[email]) {
                return reject(new Error('No user found with this email.'));
            }
            if (users[email] !== password) {
                return reject(new Error('Incorrect password.'));
            }
            sessionStorage.setItem('currentUser', email);
            setUser({ email });
            resolve();
        });
    };

    const logOut = () => {
        sessionStorage.removeItem('currentUser');
        setUser(null);
    };

    const value = { user, loading, signUp, logIn, logOut };

    return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};