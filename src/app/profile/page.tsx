/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
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
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(11).max(15).optional().or(z.literal("")),
  location: z.string().min(2).optional().or(z.literal("")),
  companyName: z.string().optional().or(z.literal("")),
});

type TProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
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
    if (user) {
      reset({
        name: user.name ?? "",
        phone: (user as any).phone ?? "",
        location: (user as any).location ?? "",
        companyName: (user as any).companyName ?? "",
      });
      setCurrentImage((user as any).image ?? null);
    }
  }, [user, reset]);

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

  const getRoleBadgeColor = (role: string) => {
    if (role === "FARMER") return "bg-green-100 text-green-700";
    if (role === "BUYER") return "bg-blue-100 text-blue-700";
    return "bg-purple-100 text-purple-700";
  };

  const getRoleIcon = (role: string) => {
    if (role === "FARMER") return "👨‍🌾";
    if (role === "BUYER") return "🛒";
    return "👑";
  };

  return (
    <div className='max-w-4xl mx-auto pt-8 pb-12  space-y-6'>
      {/* Page header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Profile</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Manage your account information and preferences
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left — profile card */}
        <div className='lg:col-span-1 space-y-4'>
          {/* Avatar card */}
          <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
            {/* Cover */}
            <div className='h-20 bg-gradient-to-r from-green-500 to-emerald-600' />

            <div className='px-6 pb-6'>
              {/* Avatar + upload */}
              <div className='flex flex-col items-center -mt-10 mb-4'>
                <div className='relative group'>
                  <div className='w-20 h-20 rounded-2xl ring-4 ring-white shadow-md overflow-hidden'>
                    <Avatar
                      src={currentImage}
                      name={user?.name ?? ""}
                      size='xl'
                    />
                  </div>

                  {/* Upload overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className='absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                    {imageUploading ? (
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    ) : (
                      <svg
                        className='w-5 h-5 text-white'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                      </svg>
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleImageUpload}
                  />
                </div>

                <p className='text-xs text-gray-400 mt-2'>
                  Click to change photo
                </p>
              </div>

              {/* User info */}
              <div className='text-center'>
                <h2 className='font-bold text-gray-900 text-lg'>
                  {user?.name}
                </h2>
                <p className='text-gray-500 text-sm'>{user?.email}</p>

                <div className='flex items-center justify-center gap-2 mt-3'>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${getRoleBadgeColor(user?.role ?? "")}`}>
                    {getRoleIcon(user?.role ?? "")} {user?.role}
                  </span>
                  {(user as any)?.isVerified ? (
                    <span className='inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-full font-medium'>
                      ✓ Verified
                    </span>
                  ) : (
                    <span className='inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-yellow-50 text-yellow-600 rounded-full font-medium'>
                      ⏳ Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats card */}
          {user?.role === "FARMER" && (
            <div className='bg-white rounded-2xl border border-gray-100 p-5'>
              <h3 className='font-semibold text-gray-900 mb-4 text-sm'>
                Wallet Balance
              </h3>
              <div className='bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 text-white'>
                <p className='text-xs text-green-100 font-medium'>
                  Available Balance
                </p>
                <p className='text-3xl font-bold mt-1'>
                  ৳{(user as any)?.walletBalance?.toFixed(2) ?? "0.00"}
                </p>
              </div>
            </div>
          )}

          {/* Account info */}
          <div className='bg-white rounded-2xl border border-gray-100 p-5'>
            <h3 className='font-semibold text-gray-900 mb-4 text-sm'>
              Account Info
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center gap-3 text-sm'>
                <div className='w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0'>
                  📧
                </div>
                <div className='min-w-0'>
                  <p className='text-xs text-gray-400'>Email</p>
                  <p className='font-medium text-gray-900 truncate'>
                    {user?.email}
                  </p>
                </div>
              </div>

              {(user as any)?.phone && (
                <div className='flex items-center gap-3 text-sm'>
                  <div className='w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0'>
                    📞
                  </div>
                  <div>
                    <p className='text-xs text-gray-400'>Phone</p>
                    <p className='font-medium text-gray-900'>
                      {(user as any).phone}
                    </p>
                  </div>
                </div>
              )}

              {(user as any)?.location && (
                <div className='flex items-center gap-3 text-sm'>
                  <div className='w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0'>
                    📍
                  </div>
                  <div>
                    <p className='text-xs text-gray-400'>Location</p>
                    <p className='font-medium text-gray-900'>
                      {(user as any).location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right — edit form */}
        <div className='lg:col-span-2'>
          <div className='bg-white rounded-2xl border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='font-bold text-gray-900'>
                  Personal Information
                </h2>
                <p className='text-sm text-gray-500 mt-0.5'>
                  Update your profile details
                </p>
              </div>
              {isDirty && (
                <span className='text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-medium'>
                  Unsaved changes
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              <Input
                label='Full Name'
                placeholder='Your full name'
                error={errors.name?.message}
                required
                {...register("name")}
              />

              {/* Read-only email */}
              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1'>
                  Email Address
                </label>
                <div className='flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg'>
                  <span className='text-gray-400 text-sm'>📧</span>
                  <span className='text-sm text-gray-500 flex-1'>
                    {user?.email}
                  </span>
                  <span className='text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full'>
                    Cannot change
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Input
                  label='Phone'
                  placeholder='01XXXXXXXXX'
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <Input
                  label='Location (District)'
                  placeholder='e.g. Dhaka, Rajshahi'
                  error={errors.location?.message}
                  {...register("location")}
                />
              </div>

              {user?.role === "BUYER" && (
                <Input
                  label='Company Name'
                  placeholder='Your company (optional)'
                  {...register("companyName")}
                />
              )}

              {/* Action buttons */}
              <div className='flex items-center gap-3 pt-2 border-t border-gray-100'>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() =>
                    reset({
                      name: user?.name ?? "",
                      phone: (user as any)?.phone ?? "",
                      location: (user as any)?.location ?? "",
                      companyName: (user as any)?.companyName ?? "",
                    })
                  }
                  disabled={!isDirty}>
                  Discard
                </Button>
                <Button
                  type='submit'
                  loading={isSubmitting}
                  disabled={!isDirty}
                  className='flex-1'>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
