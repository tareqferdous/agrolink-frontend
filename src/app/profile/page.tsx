"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { ApiResponse, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  // User data load হলে form fill করো
  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        phone: user.phone ?? "",
        location: user.location ?? "",
        companyName: user.companyName ?? "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: TProfileForm) => {
    try {
      await api.patch<ApiResponse<User>>("/api/users/profile", {
        name: data.name,
        phone: data.phone || undefined,
        location: data.location || undefined,
        companyName: data.companyName || undefined,
      });
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>Profile</h1>
          <p className='text-gray-500 text-sm mt-1'>
            Manage your account information
          </p>
        </div>

        {/* Profile card */}
        <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
          {/* Cover */}
          <div className='h-24 bg-gradient-to-r from-green-600 to-green-700' />

          {/* Avatar */}
          <div className='px-6 pb-6'>
            <div className='flex items-end gap-4 -mt-8 mb-6'>
              <div className='w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-sm flex items-center justify-center text-2xl font-bold text-green-700 bg-green-100'>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className='pb-1'>
                <p className='font-semibold text-gray-900'>{user?.name}</p>
                <div className='flex items-center gap-2'>
                  <span className='text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium'>
                    {user?.role}
                  </span>
                  {user?.isVerified ? (
                    <span className='text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium'>
                      ✓ Verified
                    </span>
                  ) : (
                    <span className='text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium'>
                      Pending verification
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Read-only info */}
            <div className='p-4 bg-gray-50 rounded-xl mb-6'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='text-gray-400'>Email</p>
                  <p className='font-medium text-gray-900 mt-0.5'>
                    {user?.email}
                  </p>
                </div>
                {user?.role === "FARMER" && (
                  <div>
                    <p className='text-gray-400'>Wallet Balance</p>
                    <p className='font-medium text-green-600 mt-0.5'>
                      ৳{user?.walletBalance?.toFixed(2) ?? "0.00"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Editable form */}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <Input
                label='Full Name'
                placeholder='Your full name'
                error={errors.name?.message}
                required
                {...register("name")}
              />

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

              {user?.role === "BUYER" && (
                <Input
                  label='Company Name'
                  placeholder='Your company name (optional)'
                  {...register("companyName")}
                />
              )}

              <div className='flex gap-3 pt-2'>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() =>
                    reset({
                      name: user?.name ?? "",
                      phone: user?.phone ?? "",
                      location: user?.location ?? "",
                      companyName: user?.companyName ?? "",
                    })
                  }
                  disabled={!isDirty}>
                  Reset
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
