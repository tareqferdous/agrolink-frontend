"use client";

import AgroLinkLogo from "@/components/shared/AgroLinkLogo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["FARMER", "BUYER"], {
    message: "Role must be FARMER or BUYER",
  }),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value))
    .refine((value) => !value || value.length >= 11, {
      message: "Phone must be at least 11 digits",
    }),
  location: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value))
    .refine((value) => !value || value.length >= 2, {
      message: "Location is required",
    }),
  companyName: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
});

type TRegisterForm = z.input<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const handleSocialLogin = async (provider: "google") => {
    const callbackURL = `${window.location.origin}/listings`;

    const result = await authClient.signIn.social({
      provider,
      callbackURL,
    });

    if (result?.error) {
      toast.error(result.error.message ?? "Google login failed");
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "BUYER" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: TRegisterForm) => {
    try {
      const result = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        // @ts-expect-error — better-auth custom fields
        role: data.role,
        phone: data.phone,
        location: data.location,
        companyName: data.companyName,
      });

      if (result.error) {
        toast.error(result.error.message ?? "Registration failed");
        return;
      }

      toast.success("Registration successful! Please login.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center mb-2'>
            <span className='dark:hidden'>
              <AgroLinkLogo variant='light' className='h-10' />
            </span>
            <span className='hidden dark:inline'>
              <AgroLinkLogo variant='dark' className='h-10' />
            </span>
          </div>
          <p className='text-gray-500 dark:text-gray-400 text-sm'>
            কৃষক থেকে সরাসরি ক্রেতা
          </p>
        </div>

        {/* Card */}
        <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6'>
            Create your account
          </h2>

          <div className='space-y-3 mb-5'>
            <div>
              <button
                type='button'
                onClick={() => handleSocialLogin("google")}
                className='w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                <Mail size={16} />
                Continue with Google
              </button>
            </div>

            <div className='flex items-center gap-2'>
              <span className='h-px flex-1 bg-gray-200 dark:bg-gray-800' />
              <span className='text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500'>
                or sign up with email
              </span>
              <span className='h-px flex-1 bg-gray-200 dark:bg-gray-800' />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Role selector */}
            <div className='grid grid-cols-2 gap-3'>
              {(["FARMER", "BUYER"] as const).map((role) => (
                <label
                  key={role}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedRole === role
                      ? "border-green-500 bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}>
                  <input
                    type='radio'
                    value={role}
                    className='hidden'
                    {...register("role")}
                  />
                  <span>{role === "FARMER" ? "🌾" : "🛒"}</span>
                  <span className='font-medium text-sm'>{role}</span>
                </label>
              ))}
            </div>
            {errors.role && (
              <p className='text-xs text-red-500'>{errors.role.message}</p>
            )}

            <Input
              label='Full Name'
              placeholder='Your full name'
              error={errors.name?.message}
              required
              {...register("name")}
            />

            <Input
              label='Email'
              type='email'
              placeholder='you@example.com'
              error={errors.email?.message}
              required
              {...register("email")}
            />

            <Input
              label='Password'
              type='password'
              placeholder='••••••••'
              error={errors.password?.message}
              required
              {...register("password")}
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

            {selectedRole === "BUYER" && (
              <Input
                label='Company Name (Optional)'
                placeholder='Your company name'
                {...register("companyName")}
              />
            )}

            <Button
              type='submit'
              loading={isSubmitting}
              className='w-full mt-2'
              size='lg'>
              Create Account
            </Button>
          </form>

          <p className='text-center text-sm text-gray-500 dark:text-gray-400 mt-6'>
            Already have an account?{" "}
            <Link
              href='/login'
              className='text-green-600 dark:text-green-400 font-medium hover:underline'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
