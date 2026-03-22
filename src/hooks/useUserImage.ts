import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export const USER_IMAGE_UPDATED = "user-image-updated";

export const useUserImage = () => {
  const { user } = useAuth();
  const [overrideImage, setOverrideImage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setOverrideImage(e.detail.image);
    };
    window.addEventListener(USER_IMAGE_UPDATED, handler as EventListener);
    return () =>
      window.removeEventListener(USER_IMAGE_UPDATED, handler as EventListener);
  }, []);

  const image = overrideImage ?? user?.image ?? null;

  return image;
};

export const dispatchImageUpdate = (imageUrl: string) => {
  window.dispatchEvent(
    new CustomEvent(USER_IMAGE_UPDATED, { detail: { image: imageUrl } }),
  );
};
