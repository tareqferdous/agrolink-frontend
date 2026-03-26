"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
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
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8'>
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
            Create your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Role selector */}
            <div className='grid grid-cols-2 gap-3'>
              {(["FARMER", "BUYER"] as const).map((role) => (
                <label
                  key={role}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedRole === role
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
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

          <p className='text-center text-sm text-gray-500 mt-6'>
            Already have an account?{" "}
            <Link
              href='/login'
              className='text-green-600 font-medium hover:underline'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
