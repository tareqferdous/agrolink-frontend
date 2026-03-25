/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ProfileFormCard from "@/components/pages/Profile/ProfileFormCard";
import ProfileHeader from "@/components/pages/Profile/ProfileHeader";
import ProfileSidebar from "@/components/pages/Profile/ProfileSidebar";
import {
  profileSchema,
  ProfileUser,
  TProfileForm,
} from "@/components/pages/Profile/profileSchema";
import { useAuth } from "@/hooks/useAuth";
import { dispatchImageUpdate } from "@/hooks/useUserImage";
import { authClient } from "@/lib/auth-client";
import api from "@/lib/axios";
import { uploadToImageBB } from "@/lib/imagebb";
import { ApiResponse, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const profileUser = user as ProfileUser | undefined;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profileUser) {
      reset({
        name: profileUser.name ?? "",
        phone: profileUser.phone ?? "",
        location: profileUser.location ?? "",
        companyName: profileUser.companyName ?? "",
      });
      setCurrentImage(profileUser.image ?? null);
    }
  }, [profileUser, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const url = await uploadToImageBB(file);
      const res = await api.patch("/api/users/profile", { image: url });

      const session = await authClient.getSession();
      dispatchImageUpdate(url);
      toast.success("Profile picture updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (data: TProfileForm) => {
    try {
      await api.patch<ApiResponse<User>>("/api/users/profile", {
        name: data.name,
        phone: data.phone || undefined,
        location: data.location || undefined,
        companyName: data.companyName || undefined,
      });
      toast.success("Profile updated successfully");
      reset(data);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className='max-w-4xl mx-auto pt-8 pb-12  space-y-6'>
      <ProfileHeader />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <ProfileSidebar
          user={profileUser}
          currentImage={currentImage}
          imageUploading={imageUploading}
          fileInputRef={fileInputRef}
          onImageUpload={handleImageUpload}
        />

        <ProfileFormCard
          user={profileUser}
          isDirty={isDirty}
          isSubmitting={isSubmitting}
          errors={errors}
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          onDiscard={() =>
            reset({
              name: profileUser?.name ?? "",
              phone: profileUser?.phone ?? "",
              location: profileUser?.location ?? "",
              companyName: profileUser?.companyName ?? "",
            })
          }
        />
      </div>
    </div>
  );
}
