import { authClient } from "@/lib/auth-client";
import { User } from "@/types";

export const useAuth = () => {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as User | undefined;
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
