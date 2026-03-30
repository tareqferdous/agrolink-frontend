import Link from "next/link";

export default function NotFound() {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center overflow-hidden relative'>
      {/* Background glow blobs */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-green-100/60 dark:bg-green-900/25 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute top-1/3 left-1/4 w-75 h-75 bg-emerald-100/50 dark:bg-emerald-900/25 rounded-full blur-2xl pointer-events-none' />
      <div className='absolute bottom-1/3 right-1/4 w-62.5 h-62.5 bg-teal-100/40 dark:bg-teal-900/20 rounded-full blur-2xl pointer-events-none' />

      {/* Dot grid */}
      <div
        className='absolute inset-0 opacity-[0.03] pointer-events-none'
        style={{
          backgroundImage:
            "radial-gradient(circle, #16a34a 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className='relative flex flex-col items-center text-center px-6'>
        {/* Giant 404 with gradient */}
        <div className='relative mb-4'>
          <p className='text-[clamp(7rem,22vw,14rem)] font-black leading-none bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent select-none'>
            404
          </p>
          {/* Floating emoji over the 404 */}
          <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
            <span className='text-5xl animate-bounce [animation-duration:2s]'>
              🌾
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className='flex items-center gap-3 mb-6 w-full max-w-xs'>
          <span className='h-px flex-1 bg-gray-200 dark:bg-gray-800' />
          <span className='text-gray-300 dark:text-gray-600 text-xs font-medium uppercase tracking-widest'>
            oops
          </span>
          <span className='h-px flex-1 bg-gray-200 dark:bg-gray-800' />
        </div>

        {/* Text */}
        <h1 className='text-2xl font-black text-gray-900 dark:text-gray-100 mb-2'>
          Page not found
        </h1>
        <p className='text-gray-400 dark:text-gray-500 text-sm leading-relaxed max-w-xs mb-8'>
          এই page টি খুঁজে পাওয়া যাচ্ছে না। হয়তো link টি ভুল অথবা page টি
          সরানো হয়েছে।
        </p>

        {/* Buttons */}
        <div className='flex flex-wrap gap-3 justify-center'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-200'>
            ← Go Home
          </Link>
          <Link
            href='/listings'
            className='inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-sm font-medium hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all shadow-sm'>
            🔍 Browse Crops
          </Link>
        </div>

        {/* Brand watermark */}
        <p className='mt-12 text-xs text-gray-300 dark:text-gray-600 font-black tracking-tight'>
          Agro
          <span className='bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent'>
            Link
          </span>
        </p>
      </div>
    </div>
  );
}
