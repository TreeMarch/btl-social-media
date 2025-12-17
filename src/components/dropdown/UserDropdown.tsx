'use client';

import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

import { useAuthStore } from '@/store/useAuthStore';

export default function UserDropdown() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <Menu as='div' className='relative'>
      <Menu.Button className='flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 transition cursor-pointer'>
        <FaUserCircle size={28} />
        <span className='hidden sm:block text-sm font-semibold text-gray-700'>
          {user?.username || user?.email || 'User'}
        </span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='opacity-0 scale-95'
        enterTo='opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='opacity-100 scale-100'
        leaveTo='opacity-0 scale-95'
      >
        <Menu.Items className='absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black/5'>
          <div className='px-4 py-3 border-b'>
            <p className='text-sm font-medium text-gray-900'>
              {user?.username || 'User'}
            </p>
            <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
          </div>

          <div className='py-1'>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href='/profile'
                  className={`block px-4 py-2 text-sm ${
                    active ? 'bg-gray-100' : ''
                  }`}
                >
                  Profile
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 ${
                    active ? 'bg-red-50' : ''
                  }`}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
