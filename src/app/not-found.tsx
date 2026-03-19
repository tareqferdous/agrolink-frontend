import Link from "next/link";

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center'>
        <p className='text-7xl mb-6'>🌾</p>
        <h1 className='text-4xl font-bold text-gray-900 mb-2'>404</h1>
        <p className='text-gray-500 mb-8'>This page does not exist</p>
        <Link
          href='/'
          className='px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors'>
          Go Home
        </Link>
      </div>
    </div>
  );
}
