import { getRatingLabel, getRoleConfig, UserProfileData } from "./types";

interface UserHeroCardProps {
  user: UserProfileData;
  averageRating: number;
  totalReviews: number;
}

export default function UserHeroCard({
  user,
  averageRating,
  totalReviews,
}: UserHeroCardProps) {
  const roleConfig = getRoleConfig(user.role);

  return (
    <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm'>
      <div
        className={`h-32 bg-linear-to-r ${roleConfig.gradient} relative overflow-hidden`}>
        <div className='absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10' />
        <div className='absolute -right-4 top-12 w-20 h-20 rounded-full bg-white/10' />
        <div className='absolute left-1/3 -bottom-6 w-24 h-24 rounded-full bg-white/5' />
      </div>

      <div className='px-6 pb-6'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5'>
          <div className='flex gap-4 -mt-10 relative z-10'>
            <div className='w-20 h-20 rounded-2xl ring-4 ring-white dark:ring-gray-900 shadow-lg overflow-hidden shrink-0'>
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div
                  className={`w-full h-full bg-linear-to-br ${roleConfig.gradient} flex items-center justify-center text-white font-bold text-2xl`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className='pt-2'>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                {user.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold ${roleConfig.bg} ${roleConfig.text}`}>
                {roleConfig.icon} {roleConfig.label}
              </span>
            </div>
          </div>

          {totalReviews > 0 && (
            <div className='sm:pt-2'>
              <div className='inline-flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-100 dark:border-yellow-800/60 px-3 py-2 rounded-xl'>
                <span className='text-yellow-500 text-lg'>★</span>
                <span className='font-bold text-gray-900 dark:text-gray-100 text-lg'>
                  {averageRating.toFixed(1)}
                </span>
                <span className='text-xs text-gray-400 dark:text-gray-500 font-medium'>
                  {getRatingLabel(averageRating)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className='grid grid-cols-3 gap-3'>
          {[
            {
              icon: "⭐",
              label: "Avg Rating",
              value:
                totalReviews > 0
                  ? `${averageRating.toFixed(1)} / 5`
                  : "No ratings",
            },
            {
              icon: "💬",
              label: "Total Reviews",
              value: `${totalReviews} review${totalReviews !== 1 ? "s" : ""}`,
            },
            {
              icon: "📅",
              label: "Member Since",
              value: new Date(user.createdAt).toLocaleDateString("en-BD", {
                year: "numeric",
                month: "short",
              }),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className='bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700'>
              <span className='text-lg'>{stat.icon}</span>
              <p className='text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium'>
                {stat.label}
              </p>
              <p className='text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5'>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {user.location && (
          <div className='flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800'>
            <span className='text-base'>📍</span>
            <span className='text-sm text-gray-600 dark:text-gray-400 font-medium'>
              {user.location}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
