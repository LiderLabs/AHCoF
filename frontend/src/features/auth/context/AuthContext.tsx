import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken, saveToken, deleteToken } from "@/src/lib/storage";
import { Member } from "@/src/types/types";

interface AuthContextValue {
  member: Member | null;
  accessToken: string | null;
  isLoading: boolean;
  setAuth: (member: Member, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getToken().then((token) => {
      setAccessToken(token);
      setIsLoading(false);
    });
  }, []);

  const setAuth = (newMember: Member, token: string) => {
    setMember(newMember);
    setAccessToken(token);
    saveToken(token);
  };

  const logout = () => {
    setMember(null);
    setAccessToken(null);
    deleteToken();
  };

  return (
    <AuthContext.Provider value={{ member, accessToken, isLoading, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}