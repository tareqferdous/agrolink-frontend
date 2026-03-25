import Avatar from "@/components/ui/Avatar";
import { ProfileUser } from "./profileSchema";

interface ProfileSidebarProps {
  user?: ProfileUser;
  currentImage: string | null;
  imageUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

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

export default function ProfileSidebar({
  user,
  currentImage,
  imageUploading,
  fileInputRef,
  onImageUpload,
}: ProfileSidebarProps) {
  return (
    <div className='lg:col-span-1 space-y-4'>
      <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
        <div className='h-20 bg-gradient-to-r from-green-500 to-emerald-600' />

        <div className='px-6 pb-6'>
          <div className='flex flex-col items-center -mt-10 mb-4'>
            <div className='relative group'>
              <div className='w-20 h-20 rounded-2xl ring-4 ring-white shadow-md overflow-hidden'>
                <Avatar src={currentImage} name={user?.name ?? ""} size='xl' />
              </div>

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
                onChange={onImageUpload}
              />
            </div>

            <p className='text-xs text-gray-400 mt-2'>Click to change photo</p>
          </div>

          <div className='text-center'>
            <h2 className='font-bold text-gray-900 text-lg'>{user?.name}</h2>
            <p className='text-gray-500 text-sm'>{user?.email}</p>

            <div className='flex items-center justify-center gap-2 mt-3'>
              <span
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${getRoleBadgeColor(user?.role ?? "")}`}>
                {getRoleIcon(user?.role ?? "")} {user?.role}
              </span>
              {user?.isVerified ? (
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
              ৳{user?.walletBalance?.toFixed(2) ?? "0.00"}
            </p>
          </div>
        </div>
      )}

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

          {user?.phone && (
            <div className='flex items-center gap-3 text-sm'>
              <div className='w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0'>
                📞
              </div>
              <div>
                <p className='text-xs text-gray-400'>Phone</p>
                <p className='font-medium text-gray-900'>{user.phone}</p>
              </div>
            </div>
          )}

          {user?.location && (
            <div className='flex items-center gap-3 text-sm'>
              <div className='w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0'>
                📍
              </div>
              <div>
                <p className='text-xs text-gray-400'>Location</p>
                <p className='font-medium text-gray-900'>{user.location}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
