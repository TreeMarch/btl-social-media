'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { TiSocialTumblerCircular } from 'react-icons/ti';

import UserDropdown from '@/components/dropdown/UserDropdown';
import ButtonLink from '@/components/links/ButtonLink';
import Skeleton from '@/components/Skeleton';

import { useAuthStore } from '@/store/useAuthStore';

export default function Header() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className='fixed inset-0 z-[100] w-full h-full' />;
  }

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <header className='sticky top-0 z-50 w-full bg-white shadow-sm'>
      <div className='layout flex h-16 items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link
            href='/'
            className='text-xl font-bold hover:text-primary-600 transition-colors flex items-center gap-2'
          >
            <TiSocialTumblerCircular className='inline' size={24} />
            iSocial Media
          </Link>
        </div>

        <div className='flex items-center gap-4'>
          {isAuthenticated ? (
            <UserDropdown />
          ) : (
            <div className='flex gap-2'>
              <ButtonLink
                href='/login'
                variant='ghost'
                size='sm'
                className='bg-[#00bfff5e] hover:bg-[#00bfff80] text-gray-800'
              >
                Login
              </ButtonLink>
              <ButtonLink
                href='/register'
                variant='ghost'
                size='sm'
                className='bg-[#70ff00a3] hover:bg-[#70ff00c0] text-gray-800'
              >
                Register
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
