"use client";

import AgroLinkLogo from "@/components/shared/AgroLinkLogo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Roles } from "@/constants/role";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type TLoginForm = z.infer<typeof loginSchema>;

type UserWithOptionalRole = {
  role?: string;
};

const getRedirectPathByRole = (role?: string) => {
  if (role === Roles.FARMER) return "/farmer/analytics";
  if (role === Roles.BUYER) return "/listings";
  if (role === Roles.ADMIN) return "/admin/analytics";
  return "/";
};

const getRoleFromProfile = async () => {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) return undefined;

    const payload = await response.json();
    return payload?.data?.role as string | undefined;
  } catch {
    return undefined;
  }
};

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "farmer1@gmail.com";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "password123";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const handleDemoFill = () => {
    setValue("email", DEMO_EMAIL, { shouldValidate: true });
    setValue("password", DEMO_PASSWORD, { shouldValidate: true });
    toast.success("Demo credentials auto-filled");
  };

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

  const onSubmit = async (data: TLoginForm) => {
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error("Invalid email or password");
        return;
      }

      const sessionResult = await authClient.getSession();
      const sessionUser = sessionResult.data?.user as
        | UserWithOptionalRole
        | undefined;
      const signedInUser = result.data?.user as
        | UserWithOptionalRole
        | undefined;

      const role =
        sessionUser?.role ?? signedInUser?.role ?? (await getRoleFromProfile());
      const redirectPath = getRedirectPathByRole(role);

      toast.success("Login successful!");

      router.replace(redirectPath);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4'>
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
            Login to your account
          </h2>

          <div className='space-y-3 mb-5'>
            <Button
              type='button'
              variant='secondary'
              className='w-full relative overflow-hidden border border-green-200 dark:border-green-700/60 bg-gradient-to-r from-green-100 via-emerald-100 to-lime-100 dark:from-green-900/40 dark:via-emerald-900/40 dark:to-lime-900/30 text-green-900 dark:text-green-100 hover:from-green-200 hover:via-emerald-200 hover:to-lime-200 dark:hover:from-green-800/60 dark:hover:via-emerald-800/60 dark:hover:to-lime-800/50 shadow-[0_6px_18px_rgba(34,197,94,0.20)] hover:shadow-[0_10px_24px_rgba(22,163,74,0.28)] transition-all duration-300'
              onClick={handleDemoFill}>
              <span className='inline-flex items-center gap-2'>
                <span className='h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse' />
                <span className='font-semibold'>Use Demo Login</span>
              </span>
            </Button>

            <div>
              <button
                type='button'
                onClick={() => handleSocialLogin("google")}
                className='w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-blue-100 dark:border-gray-700 bg-gradient-to-r from-white via-blue-50 to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:shadow-[0_8px_18px_rgba(59,130,246,0.22)] hover:-translate-y-0.5 transition-all duration-300'>
                <svg
                  width='18'
                  height='18'
                  viewBox='0 0 48 48'
                  aria-hidden='true'>
                  <path
                    fill='#FFC107'
                    d='M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.199 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.955 3.045l5.657-5.657C34.046 6.053 29.27 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-0.138-2.65-0.389-3.917z'
                  />
                  <path
                    fill='#FF3D00'
                    d='M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.154 7.955 3.045l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z'
                  />
                  <path
                    fill='#4CAF50'
                    d='M24 44c5.168 0 9.86-1.977 13.409-5.19l-6.19-5.238C29.154 35.122 26.686 36 24 36c-5.178 0-9.627-3.33-11.283-7.946l-6.521 5.025C9.511 39.556 16.227 44 24 44z'
                  />
                  <path
                    fill='#1976D2'
                    d='M43.611 20.083H42V20H24v8h11.303c-0.792 2.237-2.231 4.166-4.084 5.572l0.003-0.002l6.19 5.238C36.974 39.205 44 34 44 24c0-1.341-0.138-2.65-0.389-3.917z'
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            <div className='flex items-center gap-2'>
              <span className='h-px flex-1 bg-gray-200 dark:bg-gray-800' />
              <span className='text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500'>
                or
              </span>
              <span className='h-px flex-1 bg-gray-200 dark:bg-gray-800' />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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

            <Button
              type='submit'
              loading={isSubmitting}
              className='w-full mt-2'
              size='lg'>
              Login
            </Button>
          </form>

          <p className='text-center text-sm text-gray-500 dark:text-gray-400 mt-6'>
            Don&apos;t have an account?{" "}
            <Link
              href='/register'
              className='text-green-600 dark:text-green-400 font-medium hover:underline'>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
