import { authClient } from "@/lib/auth-client";

export const useAuth = () => {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as
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

  const isAuthenticated = !!session?.user;

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
