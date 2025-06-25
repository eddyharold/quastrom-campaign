import { SplashScreen } from "@/presentation/components/loaders/splash-screen";
import { SpaceLayout } from "@/presentation/layouts/space-layout";
import { useAuthContext } from "@/presentation/providers/auth-provider";
import { Navigate } from "react-router";

export const SpaceRouteGuard = () => {
  const { isConnected, isLoadingProfile } = useAuthContext();
  console.log(isConnected, isLoadingProfile);
  if (isLoadingProfile) return <SplashScreen />;

  return !isConnected ? <Navigate to="/login" replace /> : <SpaceLayout />;
};
