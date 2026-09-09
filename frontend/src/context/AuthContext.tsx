import React, { createContext, useContext, useEffect, useState } from "react";
import { authcheck, logout as logoutuser } from "../api/auth";

interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "STORE_OWNER";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authcheck()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await logoutuser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
