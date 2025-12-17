'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import api from '@/lib/api';

import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';

import { useAuthStore } from '@/store/useAuthStore';

// Validation Schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema.extend({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

type AuthFormData = z.infer<typeof registerSchema>;

interface AuthFormProps {
  type: 'login' | 'register';
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(
      type === 'login' ? loginSchema : registerSchema
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any,
  });

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setError(null);

    try {
      if (type === 'login') {
        const response = await api.post('/auth/login', {
          email: data.email,
          password: data.password,
        });

        // Response format: { success, message, data: { user, tokens } }
        const { user, tokens } = response.data.data;
        login(user, tokens.accessToken, tokens.refreshToken);
        router.push('/');
      } else {
        await api.post('/auth/register', {
          email: data.email,
          password: data.password,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
        });
        router.push('/login');
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const status = err.response.status;
        const data = err.response.data;

        // Handle Validation Errors (400)
        if (status === 400 && data.errors && Array.isArray(data.errors)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.errors.forEach((errorItem: any) => {
            if (
              typeof errorItem === 'object' &&
              errorItem.field &&
              errorItem.message
            ) {
              setFormError(errorItem.field as keyof AuthFormData, {
                type: 'server',
                message: errorItem.message,
              });
            }
          });
        }

        setError(data.message || 'Authentication failed');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete='on'
      className='space-y-4 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'
    >
      <h2 className='text-2xl font-bold text-center mb-6'>
        {type === 'login' ? 'Login' : 'Create Account'}
      </h2>

      {error && (
        <div className='p-3 text-sm text-red-500 bg-red-50 rounded-md'>
          {error}
        </div>
      )}

      {type === 'register' && (
        <>
          <Input
            label='Username'
            placeholder='johndoe'
            autoComplete='username'
            error={errors.username?.message}
            {...register('username')}
          />
          <div className='flex gap-4'>
            <Input
              label='First Name'
              placeholder='John'
              autoComplete='given-name'
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label='Last Name'
              autoComplete='family-name'
              placeholder='Doe'
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
        </>
      )}

      <Input
        label='Email Address'
        type='email'
        autoComplete='email'
        placeholder='you@example.com'
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label='Password'
        type='password'
        autoComplete={type === 'login' ? 'current-password' : 'new-password'}
        placeholder='••••••••'
        error={errors.password?.message}
        {...register('password')}
      />

      <Button
        type='submit'
        isLoading={loading}
        className='w-full justify-center'
      >
        {type === 'login' ? 'Sign In' : 'Sign Up'}
      </Button>

      <div className='text-center text-sm text-gray-600 mt-4'>
        {type === 'login' ? (
          <p>
            Don't have an account?{' '}
            <a href='/register' className='text-primary-600 hover:underline'>
              Register
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <a href='/login' className='text-primary-600 hover:underline'>
              Login
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
