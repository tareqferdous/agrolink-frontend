import Link from "next/link";

const DashboardFooter = () => {
  return (
    <footer className='border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-5'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          © 2026 AgroLink Dashboard. Fair trade, every harvest.
        </p>

        <div className='flex items-center gap-5 text-xs text-gray-500 dark:text-gray-400'>
          <Link
            href='/listings'
            className='hover:text-gray-700 dark:hover:text-gray-200 transition-colors'>
            Browse Listings
          </Link>
          <Link
            href='/profile'
            className='hover:text-gray-700 dark:hover:text-gray-200 transition-colors'>
            Profile
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
