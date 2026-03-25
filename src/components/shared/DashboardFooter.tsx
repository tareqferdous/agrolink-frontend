import Link from "next/link";

const DashboardFooter = () => {
  return (
    <footer className='border-t border-gray-200 bg-white px-6 py-5'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-xs text-gray-500'>
          © 2026 AgroLink Dashboard. Fair trade, every harvest.
        </p>

        <div className='flex items-center gap-5 text-xs text-gray-500'>
          <Link
            href='/listings'
            className='hover:text-gray-700 transition-colors'>
            Browse Listings
          </Link>
          <Link
            href='/profile'
            className='hover:text-gray-700 transition-colors'>
            Profile
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
