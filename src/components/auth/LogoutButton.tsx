'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

import Button from '@/components/buttons/Button';

import { useAuthStore } from '@/store/useAuthStore';

export default function LogoutButton() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Button
      onClick={handleLogout}
      variant='ghost'
      size='base'
      className='rounded-full cursor-pointer'
    >
      Log Out
    </Button>
  );
}
