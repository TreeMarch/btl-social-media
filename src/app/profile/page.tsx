'use client';

import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import * as React from 'react';
import { FaCamera, FaPen } from 'react-icons/fa';

import api from '@/lib/api';

import Avatar from '@/components/Avatar';
import Button from '@/components/buttons/Button';
import Skeleton from '@/components/Skeleton';

import { useAuthStore } from '@/store/useAuthStore';

export default function ProfileUserPage() {
  const { user, setUser } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [setUser]);

  if (!mounted) {
    return (
      <div className='container mx-auto max-w-4xl p-4 space-y-4'>
        <Skeleton className='h-48 w-full rounded-xl' />
        <div className='flex items-end px-4 -mt-12 mb-4'>
          <Skeleton className='h-32 w-32 rounded-full border-4 border-white' />
          <div className='ml-4 mb-2 space-y-2'>
            <Skeleton className='h-6 w-48' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className='p-8 text-center'>Please login to view profile.</div>;
  }

  const stats = [
    { label: 'Posts', value: user.stats?.postsCount || 0 },
    { label: 'Followers', value: user.stats?.followersCount || 0 },
    { label: 'Following', value: user.stats?.followingCount || 0 },
  ];

  return (
    <div className='min-h-screen bg-gray-50 pb-8'>
      {/* Cover Image */}
      <div className='relative h-60 w-full bg-gradient-to-r from-blue-400 to-indigo-500'>
        {/* Placeholder for Cover Image */}
        <button className='absolute bottom-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition'>
          <FaCamera />
        </button>
      </div>

      <div className='container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
        <div className='relative -mt-16 sm:-mt-20 mb-6'>
          <div className='flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6'>
            {/* Avatar */}
            <div className='relative'>
              <Avatar
                src={user.avatar}
                initials={user.firstName?.[0] || user.username?.[0]}
                size='xl'
                className='h-32 w-32 sm:h-40 sm:w-40 ring-4 ring-white bg-white'
              />
              <button className='absolute bottom-2 right-2 p-1.5 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 border-2 border-white'>
                <FaCamera size={14} />
              </button>
            </div>

            {/* Info */}
            <div className='flex-1 text-center sm:text-left mb-6'>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
                {user.firstName} {user.lastName}
              </h1>
              <p className='text-gray-500 font-medium text-white'>
                @{user.username}
              </p>
              <div className='flex justify-center sm:justify-start gap-6 mt-3'>
                {stats.map((stat) => (
                  <div key={stat.label} className='text-center sm:text-left'>
                    <span className='block font-bold text-gray-900 text-lg'>
                      {stat.value}
                    </span>
                    <span className='text-sm text-gray-500'>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-2 mb-4 sm:mb-2'>
              <Button variant='outline' className='gap-2'>
                <FaPen size={14} /> Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tab.Group>
          <Tab.List className='flex space-x-1 rounded-xl bg-white p-1 shadow-sm border'>
            {['Posts', 'About', 'Photos', 'Friends'].map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  clsx(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition focus:outline-none',
                    selected
                      ? 'bg-blue-50 text-blue-700 shadow'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className='mt-6'>
            <Tab.Panel className='rounded-xl bg-white p-6 shadow-sm border min-h-[300px]'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                Recent Posts
              </h3>
              <p className='text-gray-500 text-center py-10'>No posts yet.</p>
            </Tab.Panel>
            <Tab.Panel className='rounded-xl bg-white p-6 shadow-sm border'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                About
              </h3>
              <div className='space-y-4'>
                <div>
                  <span className='font-medium text-gray-700'>Email:</span>
                  <span className='ml-2 text-gray-600'>{user.email}</span>
                </div>
                <div>
                  <span className='font-medium text-gray-700'>Username:</span>
                  <span className='ml-2 text-gray-600'>{user.username}</span>
                </div>
                <div>
                  <span className='font-medium text-gray-700'>Joined:</span>
                  <span className='ml-2 text-gray-600'>
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel className='rounded-xl bg-white p-6 shadow-sm border'>
              Content for Photos
            </Tab.Panel>
            <Tab.Panel className='rounded-xl bg-white p-6 shadow-sm border'>
              Content for Friends
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
