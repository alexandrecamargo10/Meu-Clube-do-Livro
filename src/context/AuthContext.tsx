'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Role } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string, role?: Role) => void;
  logout: () => void;
  updateRole: (role: Role) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Carregar usuário do localStorage na montagem
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('meu_clube_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Usuário padrão de demonstração conectado
        const defaultUser: UserProfile = {
          id: 'usr_alexandre_master',
          name: 'Alexandre',
          email: 'alexandre@meuclubedolivro.com',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'MASTER',
          bio: 'Criador do clube e apaixonado por Ficção Científica, Fantasia e Mangás.',
        };
        setUser(defaultUser);
        localStorage.setItem('meu_clube_user', JSON.stringify(defaultUser));
      }
    } catch {
      // Caso localStorage falhe
    }
  }, []);

  const login = (email: string, name?: string, role: Role = 'FREE') => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      role,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    try {
      localStorage.setItem('meu_clube_user', JSON.stringify(newUser));
    } catch {}
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('meu_clube_user');
    } catch {}
  };

  const updateRole = (newRole: Role) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    try {
      localStorage.setItem('meu_clube_user', JSON.stringify(updated));
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateRole,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
