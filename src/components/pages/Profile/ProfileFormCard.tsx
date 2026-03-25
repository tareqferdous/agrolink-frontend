import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { ProfileUser, TProfileForm } from "./profileSchema";

interface ProfileFormCardProps {
  user?: ProfileUser;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: FieldErrors<TProfileForm>;
  register: UseFormRegister<TProfileForm>;
  handleSubmit: UseFormHandleSubmit<TProfileForm>;
  onSubmit: (data: TProfileForm) => Promise<void>;
  onDiscard: () => void;
}

export default function ProfileFormCard({
  user,
  isDirty,
  isSubmitting,
  errors,
  register,
  handleSubmit,
  onSubmit,
  onDiscard,
}: ProfileFormCardProps) {
  return (
    <div className='lg:col-span-2'>
      <div className='bg-white rounded-2xl border border-gray-100 p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='font-bold text-gray-900'>Personal Information</h2>
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

          <div className='flex items-center gap-3 pt-2 border-t border-gray-100'>
            <Button
              type='button'
              variant='secondary'
              onClick={onDiscard}
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
  );
}
