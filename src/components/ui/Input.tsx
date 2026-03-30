import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", ...props }, ref) => {
    return (
      <div className='flex flex-col gap-1'>
        {label && (
          <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            {label}
            {props.required && <span className='text-red-500 ml-1'>*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors
            ${
              error
                ? "border-red-500 dark:border-red-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            }
            bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
            disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400
            ${className}`}
          {...props}
        />
        {error && <p className='text-xs text-red-500'>{error}</p>}
        {hint && !error && (
          <p className='text-xs text-gray-500 dark:text-gray-400'>{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
