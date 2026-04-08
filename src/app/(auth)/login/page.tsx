"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Roles } from "@/constants/role";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
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

const DEMO_EMAIL =
  process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "demo.buyer@agrolink.com";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "123456";

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
          <div className='inline-flex items-center gap-2 mb-2'>
            <span className='text-3xl'>🌾</span>
            <h1 className='text-2xl font-bold text-green-700'>AgroLink</h1>
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
              className='w-full'
              onClick={handleDemoFill}>
              Use Demo Login
            </Button>

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
