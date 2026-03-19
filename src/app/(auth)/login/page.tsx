"use client";

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
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type TLoginForm = z.infer<typeof loginSchema>;

const getRedirectPathByRole = (role?: string) => {
  if (role === Roles.FARMER) return "/farmer/listings";
  if (role === Roles.BUYER) return "/buyer/listings";
  if (role === Roles.ADMIN) return "/admin/analytics";
  return "/";
};

const getRoleFromProfile = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!response.ok) return undefined;

    const payload = await response.json();
    return payload?.data?.role as string | undefined;
  } catch {
    return undefined;
  }
};

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: TLoginForm) => {
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message ?? "Login failed");
        return;
      }

      const sessionResult = await authClient.getSession();
      const role =
        (sessionResult.data?.user as any)?.role ??
        (result.data?.user as any)?.role ??
        (await getRoleFromProfile());
      const redirectPath = getRedirectPathByRole(role);

      toast.success("Login successful!");

      router.replace(redirectPath);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center gap-2 mb-2'>
            <span className='text-3xl'>🌾</span>
            <h1 className='text-2xl font-bold text-green-700'>AgroLink</h1>
          </div>
          <p className='text-gray-500 text-sm'>কৃষক থেকে সরাসরি ক্রেতা</p>
        </div>

        {/* Card */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>
          <h2 className='text-xl font-semibold text-gray-900 mb-6'>
            Login to your account
          </h2>

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

          <p className='text-center text-sm text-gray-500 mt-6'>
            Don&apos;t have an account?{" "}
            <Link
              href='/register'
              className='text-green-600 font-medium hover:underline'>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
