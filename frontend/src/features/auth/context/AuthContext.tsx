import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken, saveToken, deleteToken, saveRefreshToken, deleteRefreshToken } from "@/src/lib/storage";
import { Member } from "@/src/types/types";

interface AuthContextValue {
  member: Member | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  setAuth: (member: Member, token: string, refreshToken: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getToken().then((token) => {
      setAccessToken(token);
      setIsLoading(false);
    });
  }, []);

  const setAuth = (newMember: Member, newAccessToken: string, newRefreshToken: string | null) => {
    setMember(newMember);
    setAccessToken(newAccessToken);
    saveToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    if (newRefreshToken) {
      saveRefreshToken(newRefreshToken);
    }
  };

  const logout = () => {
    setMember(null);
    setAccessToken(null);
    setRefreshToken(null);
    deleteToken();
    deleteRefreshToken();
  };

  return (
    <AuthContext.Provider value={{ member, accessToken, refreshToken, isLoading, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}