'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import {Input} from '@/components/ui/Input';
import {Button} from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const t = useTranslations();
  const { login, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      setError('root', {
        message: err.response?.data?.detail || t('loginError'),
      });
    }
  };

  return (
    <div className="container-narrow py-24">
      <div className="max-w-md mx-auto">
        <Card>
          <h1 className="text-3xl font-serif mb-6">{t('login')}</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('email')}
              type="email"
              {...register('email', { required: t('required') })}
              error={errors.email?.message}
            />

            <Input
              label={t('password')}
              type="password"
              {...register('password', { required: t('required') })}
              error={errors.password?.message}
            />

            {errors.root && (
              <p className="text-sm text-red-500">{errors.root.message}</p>
            )}

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? t('loggingIn') : t('login')}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            {t('noAccount')}{' '}
            <Link href="/register" className="text-accent-300 hover:underline">
              {t('register')}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}