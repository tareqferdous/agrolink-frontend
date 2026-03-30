export default function Loading() {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center overflow-hidden relative'>
      {/* Background glow blobs — same as hero */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-green-100/60 dark:bg-green-900/25 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute top-1/3 left-1/3 w-75 h-75 bg-emerald-100/50 dark:bg-emerald-900/25 rounded-full blur-2xl pointer-events-none' />
      <div className='absolute bottom-1/3 right-1/3 w-62.5 h-62.5 bg-teal-100/40 dark:bg-teal-900/20 rounded-full blur-2xl pointer-events-none' />

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
      <div className='relative flex flex-col items-center gap-6'>
        {/* Logo mark */}
        <div className='relative'>
          {/* Outer ring — slow pulse */}
          <div className='w-20 h-20 rounded-full border-2 border-green-100 animate-ping absolute inset-0 opacity-40' />
          {/* Spinner ring */}
          <div className='w-20 h-20 rounded-full border-[3px] border-green-100 border-t-green-500 animate-spin' />
          {/* Center icon */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='text-2xl'>🌾</span>
          </div>
        </div>

        {/* Brand name */}
        <div className='flex flex-col items-center gap-1.5'>
          <p className='text-xl font-black tracking-tight text-gray-900 dark:text-gray-100'>
            Agro
            <span className='bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent'>
              Link
            </span>
          </p>
          {/* Animated dots */}
          <div className='flex items-center gap-1.5'>
            <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce [animation-delay:0ms]' />
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]' />
            <span className='w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:300ms]' />
          </div>
        </div>
      </div>
    </div>
  );
}
