'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';



























// Demo accounts per role
const DEMO_USERS = [
{ id: '1', name: 'Admin Manager', email: 'manager@FleetIQ.com', password: 'fleet123', role: 'fleet_manager' },
{ id: '2', name: 'Alex Dispatcher', email: 'dispatch@FleetIQ.com', password: 'fleet123', role: 'dispatcher' },
{ id: '3', name: 'Sara Safety', email: 'safety@FleetIQ.com', password: 'fleet123', role: 'safety_officer' },
{ id: '4', name: 'Finance Analyst', email: 'finance@FleetIQ.com', password: 'fleet123', role: 'financial_analyst' }];


const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('FleetIQ_user');
      if (stored) setUser(JSON.parse(stored));
    } catch (_) {}
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    await new Promise((r) => setTimeout(r, 700));

    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    // Also check registered accounts
    let regMatch = null;
    try {
      const reg = JSON.parse(
        localStorage.getItem('FleetIQ_registered') || '[]'
      );
      const m = reg.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (m) {
        const { password: _, ...u } = m;
        regMatch = u;
      }
    } catch (_) {}

    const matched = found ?
    (() => {const { password: _, ...u } = found;return u;})() :
    regMatch;

    if (matched) {
      setUser(matched);
      localStorage.setItem('FleetIQ_user', JSON.stringify(matched));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  const register = async (data) => {
    await new Promise((r) => setTimeout(r, 700));

    // Check duplicate in demo + registered
    const allEmails = [
    ...DEMO_USERS.map((u) => u.email.toLowerCase()),
    ...(() => {
      try {return JSON.parse(localStorage.getItem('FleetIQ_registered') || '[]').map((u) => u.email.toLowerCase());}
      catch (_) {return [];}
    })()];

    if (allEmails.includes(data.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role
    };
    try {
      const list = JSON.parse(localStorage.getItem('FleetIQ_registered') || '[]');
      list.push(newUser);
      localStorage.setItem('FleetIQ_registered', JSON.stringify(list));
    } catch (_) {}

    const { password: _, ...withoutPw } = newUser;
    setUser(withoutPw);
    localStorage.setItem('FleetIQ_user', JSON.stringify(withoutPw));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {localStorage.removeItem('FleetIQ_user');} catch (_) {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>);

}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export const ROLE_LABELS = {
  fleet_manager: 'Fleet Manager',
  dispatcher: 'Dispatcher',
  safety_officer: 'Safety Officer',
  financial_analyst: 'Financial Analyst'
};

export const ROLE_COLORS = {
  fleet_manager: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  dispatcher: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  safety_officer: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  financial_analyst: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
};