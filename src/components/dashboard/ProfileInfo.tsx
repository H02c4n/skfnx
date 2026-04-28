'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types';
import {Input} from '../ui/Input';
import {Button} from '../ui/Button';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  phone: string;
  bio: string;
}

export default function ProfileInfo({ user }: { user: User }) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileFormData>({
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone || '',
      bio: user.bio || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormData) => api.patch('/me/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
      <h3 className="font-serif text-xl mb-4">{t('profile')}</h3>
      <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('firstName')} {...register('first_name', { required: t('required') })} error={errors.first_name?.message} />
          <Input label={t('lastName')} {...register('last_name', { required: t('required') })} error={errors.last_name?.message} />
        </div>
        <Input label={t('phone')} {...register('phone')} />
        <div className="space-y-1">
          <label className="block text-sm font-medium">{t('bio')}</label>
          <textarea
            {...register('bio')}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-300"
          />
        </div>
        <Button type="submit" variant="primary" loading={updateMutation.isPending} disabled={updateMutation.isPending || !isDirty}>
          {t('save')}
        </Button>
      </form>
    </div>
  );
}