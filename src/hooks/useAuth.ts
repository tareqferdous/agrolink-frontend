import { authClient } from "@/lib/auth-client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const AUTH_USER_PATCH_STORAGE_KEY = "agrolink_auth_user_patch";

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

const isValidAuthUserPatch = (value: unknown): value is AuthUserPatch => {
  if (!value || typeof value !== "object") return false;
  const maybePatch = value as { id?: unknown };
  return typeof maybePatch.id === "string" && maybePatch.id.length > 0;
};

const readPatchFromStorage = (): AuthUserPatch | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(AUTH_USER_PATCH_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    return isValidAuthUserPatch(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const writePatchToStorage = (patch: AuthUserPatch | null) => {
  if (typeof window === "undefined") return;

  if (!patch) {
    window.localStorage.removeItem(AUTH_USER_PATCH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    AUTH_USER_PATCH_STORAGE_KEY,
    JSON.stringify(patch),
  );
};

const getPatchSnapshot = () => {
  if (userPatchStore === null) {
    userPatchStore = readPatchFromStorage();
  }

  return userPatchStore;
};

const subscribePatch = (listener: () => void) => {
  patchListeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== AUTH_USER_PATCH_STORAGE_KEY) return;

    userPatchStore = readPatchFromStorage();
    emitPatchChange();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    patchListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
};

const emitPatchChange = () => {
  patchListeners.forEach((listener) => listener());
};

export const dispatchAuthUserUpdate = (patch: AuthUserPatch) => {
  userPatchStore = {
    ...(getPatchSnapshot() ?? {}),
    ...patch,
    id: patch.id,
  };
  writePatchToStorage(userPatchStore);
  emitPatchChange();
};

const clearAuthUserUpdate = () => {
  userPatchStore = null;
  writePatchToStorage(null);
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
    getPatchSnapshot,
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
