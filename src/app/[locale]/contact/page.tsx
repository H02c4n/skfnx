'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useSettings } from '@/hooks/useSettings';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { MailIcon, PhoneIcon, MapPinIcon } from '@/components/ui/Icons';
import toast from 'react-hot-toast';


interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const t = useTranslations();
  const { settings } = useSettings();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<ContactFormData>();

  const mutation = useMutation({
    mutationFn: (data: ContactFormData) => api.post('/contact/', data),
    onSuccess: () => {
      reset();
      toast.success(t('contactSuccess'));
    },
    onError: (error: any) => {
      const data = error.response?.data;

      if (data?.email) {
        setError('email', { message: data.email[0] });
      } else if (data?.name) {
        setError('name', { message: data.name[0] });
      } else if (data?.subject) {
        setError('subject', { message: data.subject[0] });
      } else if (data?.message) {
        setError('message', { message: data.message[0] });
      } else {
        // Genel hata → toast
        const errorMsg = data?.detail
          ?? data?.non_field_errors?.[0]
          ?? t('contactError');
        toast.error(errorMsg);
      }
    },
  });

  const onSubmit = (data: ContactFormData) => mutation.mutate(data);

  return (
    <div className="container-narrow py-24">
      <h1 className="text-4xl font-serif mb-8">{t('contact')}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errors.root && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {errors.root.message}
                </div>
              )}

              <Input
                label={t('name')}
                {...register('name', { required: t('required') })}
                error={errors.name?.message}
              />
              <Input
                label={t('email')}
                type="email"
                {...register('email', {
                  required: t('required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('invalidEmail'),
                  },
                })}
                error={errors.email?.message}
              />
              <Input
                label={t('subject')}
                {...register('subject', { required: t('required') })}
                error={errors.subject?.message}
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium">{t('message')}</label>
                <textarea
                  {...register('message', { required: t('required') })}
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-300 transition"
                />
                {errors.message && (
                  <p className="text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                loading={mutation.isPending}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? t('sending') : t('send')}
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="font-serif text-xl mb-4">{t('contactInfo')}</h3>
            <dl className="space-y-3 text-sm">
              {settings?.email && (
                <div className="flex items-center gap-3">
                  <MailIcon />
                  <dd>{settings.email}</dd>
                </div>
              )}
              {settings?.phone && (
                <div className="flex items-center gap-3">
                  <PhoneIcon />
                  <dd>{settings.phone}</dd>
                </div>
              )}
              {settings?.address && (
                <div className="flex items-start gap-3">
                  <MapPinIcon />
                  <dd className="whitespace-pre-line">{settings.address}</dd>
                </div>
              )}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}