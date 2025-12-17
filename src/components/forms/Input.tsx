import { clsx } from 'clsx';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && (
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            {label}
          </label>
        )}
        <div className='relative'>
          <input
            ref={ref}
            className={twMerge(
              clsx(
                'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
                error &&
                  'border-red-500 focus:border-red-500 focus:ring-red-500',
                className
              )
            )}
            {...props}
          />
        </div>
        {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
