'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import {Input} from '@/components/ui/Input';
import {Button} from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface RegisterFormData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  password2: string;
}

export default function RegisterPage() {
  const t = useTranslations();
  const { register: registerUser, loading } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
    } catch (err: any) {
      const apiErrors = err.response?.data;
      if (apiErrors) {
        Object.keys(apiErrors).forEach((field) => {
          setError(field as keyof RegisterFormData, {
            message: Array.isArray(apiErrors[field])
              ? apiErrors[field][0]
              : apiErrors[field],
          });
        });
      } else {
        setError('root', { message: t('registrationError') });
      }
    }
  };

  return (
    <div className="container-narrow py-24">
      <div className="max-w-md mx-auto">
        <Card>
          <h1 className="text-3xl font-serif mb-6">{t('register')}</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('email')}
              type="email"
              {...register('email', { required: t('required') })}
              error={errors.email?.message}
            />

            <Input
              label={t('username')}
              {...register('username', { required: t('required') })}
              error={errors.username?.message}
            />

            <Input
              label={t('firstName')}
              {...register('first_name', { required: t('required') })}
              error={errors.first_name?.message}
            />

            <Input
              label={t('lastName')}
              {...register('last_name', { required: t('required') })}
              error={errors.last_name?.message}
            />

            <Input
              label={t('password')}
              type="password"
              {...register('password', {
                required: t('required'),
                minLength: {
                  value: 8,
                  message: t('passwordMinLength'),
                },
              })}
              error={errors.password?.message}
            />

            <Input
              label={t('confirmPassword')}
              type="password"
              {...register('password2', {
                required: t('required'),
                validate: (value) =>
                  value === password || t('passwordsDoNotMatch'),
              })}
              error={errors.password2?.message}
            />

            {errors.root && (
              <p className="text-sm text-red-500">{errors.root.message}</p>
            )}

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? t('registering') : t('register')}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            {t('alreadyHaveAccount')}{' '}
            <Link href="/login" className="text-accent-300 hover:underline">
              {t('login')}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}