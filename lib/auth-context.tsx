"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, UserRole } from "./types";
import {
  getCurrentUser,
  logout as apiLogout,
  switchRole as apiSwitchRole,
} from "./api";

interface AuthContextValue {
  user: Omit<User, "password"> | null;
  loading: boolean;
  setUser: (user: Omit<User, "password"> | null) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: () => {},
  switchRole: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getCurrentUser();
    setUser(stored);
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    apiSwitchRole(role);
    const updated = getCurrentUser();
    setUser(updated);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
