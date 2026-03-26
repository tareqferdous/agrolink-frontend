import { authClient } from "@/lib/auth-client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export const useAuth = () => {
  const { data: session, isPending } = authClient.useSession();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const sessionUser = hydrated ? session?.user : undefined;

  const user = sessionUser as
    | {
        id: string;
        name: string;
        email: string;
        role: string;
        phone?: string;
        location?: string;
        companyName?: string;
        isVerified: boolean;
        isBanned: boolean;
        walletBalance: number;
        image?: string;
      }
    | undefined;

  const isAuthenticated = !!sessionUser;

  const logout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  return {
    user,
    isAuthenticated,
    isPending,
    logout,
  };
};
