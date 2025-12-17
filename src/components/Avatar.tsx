import clsx from 'clsx';
import Image from 'next/image';
import * as React from 'react';

type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  initials?: string;
};

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-base',
  xl: 'h-24 w-24 text-xl',
  '2xl': 'h-32 w-32 text-2xl',
};

export default function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  className,
  initials,
}: AvatarProps & { size?: keyof typeof sizes }) {
  return (
    <div
      className={clsx(
        'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600',
        sizes[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      ) : (
        <span className='font-medium text-gray-600 dark:text-gray-300'>
          {initials || '?'}
        </span>
      )}
    </div>
  );
}
