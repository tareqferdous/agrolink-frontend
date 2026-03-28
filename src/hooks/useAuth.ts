import { authClient } from "@/lib/auth-client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

type AuthUser = {
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
};

type AuthUserPatch = Partial<AuthUser> & { id: string };

let userPatchStore: AuthUserPatch | null = null;
const patchListeners = new Set<() => void>();

const subscribePatch = (listener: () => void) => {
  patchListeners.add(listener);
  return () => patchListeners.delete(listener);
};

const emitPatchChange = () => {
  patchListeners.forEach((listener) => listener());
};

export const dispatchAuthUserUpdate = (patch: AuthUserPatch) => {
  userPatchStore = {
    ...(userPatchStore ?? {}),
    ...patch,
    id: patch.id,
  };
  emitPatchChange();
};

const clearAuthUserUpdate = () => {
  userPatchStore = null;
  emitPatchChange();
};

export const useAuth = () => {
  const { data: session, isPending } = authClient.useSession();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const userPatch = useSyncExternalStore(
    subscribePatch,
    () => userPatchStore,
    () => null,
  );

  const sessionUser = hydrated ? session?.user : undefined;

  const baseUser = sessionUser as AuthUser | undefined;
  const user =
    baseUser && userPatch?.id === baseUser.id
      ? ({ ...baseUser, ...userPatch } as AuthUser)
      : baseUser;

  const isAuthenticated = !!sessionUser;

  const logout = async () => {
    clearAuthUserUpdate();
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
