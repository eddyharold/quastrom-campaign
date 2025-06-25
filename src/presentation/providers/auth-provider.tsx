import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { httpClient } from "@/infrastructure/api/http-client";
import { User } from "@/domain/entities/user";
import { useGetProfileQuery } from "@/application/use-cases/get-profile-query";
import { tokenManager } from "@/infrastructure/auth/token-manager";

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
  const isLoggedIn = !!tokenManager.getToken();
  const { data: currentUser, isLoading: isProfileLoading } = useGetProfileQuery(!user && isLoggedIn);

  const clearUser = useCallback(() => {
    setUser(null);
    tokenManager.clearToken();
  }, []);

  useEffect(() => {
    setUser(currentUser ?? null);
  }, [currentUser]);

  useEffect(() => {
    const interceptorId = httpClient.catchUnauthorizedResponse(clearUser);

    return () => {
      if (interceptorId) {
        httpClient.rejectResponseInterceptor(interceptorId);
      }
    };
  }, [clearUser]);

  const updateUser = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  const providerValue = useMemo(
    () => ({
      user,
      isConnected: isLoggedIn,
      isLoadingProfile: isProfileLoading,
      updateUser,
      clearUser,
    }),
    [user, isLoggedIn, isProfileLoading, updateUser, clearUser]
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
