import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import api from "../lib/api";

interface AuthState {
  token: string | null;
  admin: { id: string; email: string } | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem("deskspace_token"),
    admin: null,
    loading: true,
  });

  const verify = useCallback(async () => {
    const token = localStorage.getItem("deskspace_token");
    if (!token) {
      setState({ token: null, admin: null, loading: false });
      return;
    }
    try {
      const { data } = await api.get("/admin/me");
      setState({ token, admin: { id: data._id, email: data.email }, loading: false });
    } catch {
      localStorage.removeItem("deskspace_token");
      setState({ token: null, admin: null, loading: false });
    }
  }, []);

  useEffect(() => {
    verify();
  }, [verify]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/admin/login", { email, password });
    localStorage.setItem("deskspace_token", data.token);
    setState({ token: data.token, admin: data.admin, loading: false });
  };

  const logout = () => {
    localStorage.removeItem("deskspace_token");
    setState({ token: null, admin: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
