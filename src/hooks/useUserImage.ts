import { useSyncExternalStore } from "react";
import { useAuth } from "./useAuth";

export const USER_IMAGE_UPDATED = "user-image-updated";
const USER_IMAGE_STORAGE_KEY = "agrolink-user-image";

type UserImageState = {
  userId: string | null;
  image: string | null;
};

const defaultState: UserImageState = { userId: null, image: null };

let store: UserImageState = defaultState;
const listeners = new Set<() => void>();
let initialized = false;

const readStoredState = (): UserImageState => {
  if (typeof window === "undefined") return defaultState;

  try {
    const raw = window.localStorage.getItem(USER_IMAGE_STORAGE_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw) as Partial<UserImageState>;
    return {
      userId: typeof parsed.userId === "string" ? parsed.userId : null,
      image: typeof parsed.image === "string" ? parsed.image : null,
    };
  } catch {
    return defaultState;
  }
};

const ensureInitialized = () => {
  if (initialized || typeof window === "undefined") return;
  store = readStoredState();
  initialized = true;
};

const persistState = (state: UserImageState) => {
  if (typeof window === "undefined") return;

  try {
    if (!state.userId || !state.image) {
      window.localStorage.removeItem(USER_IMAGE_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(USER_IMAGE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage failures (private mode, blocked storage, etc.)
  }
};

const emit = () => {
  listeners.forEach((listener) => listener());
};

const setStore = (next: UserImageState) => {
  store = next;
  persistState(next);
  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => {
  ensureInitialized();
  return store;
};

const getServerSnapshot = () => defaultState;

export const useUserImage = () => {
  const { user } = useAuth();
  const imageState = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!user?.id) return null;

  if (imageState.userId === user.id && imageState.image) {
    return imageState.image;
  }

  return user.image ?? null;
};

export const dispatchImageUpdate = (imageUrl: string, userId?: string) => {
  setStore({ userId: userId ?? null, image: imageUrl });

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(USER_IMAGE_UPDATED, {
        detail: { image: imageUrl, userId: userId ?? null },
      }),
    );
  }
};
