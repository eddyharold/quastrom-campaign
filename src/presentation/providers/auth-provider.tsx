import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { interceptUnauthorized } from "@/infrastructure/api/interceptors/response-interceptor";
import { httpClient } from "@/infrastructure/api/http-client";
import { User } from "@/domain/entities/user";
import { useGetProfileQuery } from "@/application/use-cases/get-profile-query";
import { localStorageAdapter } from "@/infrastructure/storage/local-storage-adapter";
import { TOKEN_KEY } from "@/domain/constants/api";

interface AuthContextType {
  user: User | null;
  isConnected: boolean;
  isLoadingProfile: boolean;
  updateUser: (user: User | null) => void;
  clearUser: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const loginBefore = localStorageAdapter.get(TOKEN_KEY);
  const { data: currentUser, isLoading: isProfileLoading } = useGetProfileQuery(!user && !!loginBefore);

  const clearUser = useCallback(() => {
    setUser(null);
    localStorageAdapter.clear();
  }, []);

  useEffect(() => {
    setUser(currentUser ?? null);
  }, [currentUser]);

  useEffect(() => {
    const interceptorId = interceptUnauthorized(clearUser);
    
    return () => {
      if (interceptorId) {
        httpClient.interceptors.response.eject(interceptorId);
      }
    };
  }, [clearUser]);

  const updateUser = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  const providerValue = useMemo(
    () => ({
      user,
      isConnected: !!user,
      isLoadingProfile: isProfileLoading,
      updateUser,
      clearUser,
    }),
    [user, isProfileLoading, updateUser, clearUser]
  );

  return <AuthContext.Provider value={providerValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};
