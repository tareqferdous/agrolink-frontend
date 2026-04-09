"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 grid place-items-center p-6'>
        <div className='max-w-md w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 text-center shadow-sm'>
          <h2 className='text-xl font-semibold'>Something went wrong</h2>
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            Please try again. If the issue continues, contact support.
          </p>
          {error?.digest && (
            <p className='mt-2 text-xs text-gray-400 dark:text-gray-500'>
              Ref: {error.digest}
            </p>
          )}
          <button
            type='button'
            onClick={reset}
            className='mt-4 inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors'>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
