'use client';

import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { sv, enUS, tr } from 'date-fns/locale';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/ui/Loader';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CalendarIcon, MapPinIcon, UsersIcon, CreditCardIcon } from '@/components/ui/Icons';

type SupportedLocale = 'sv' | 'en' | 'tr';

const getDateLocale = (locale: string) => {
  switch (locale) {
    case 'sv': return sv;
    case 'en': return enUS;
    case 'tr': return tr;
    default: return sv;
  }
};

interface EventDetail {
  id: number;
  slug: string;
  image: string | null;
  date_time: string;
  price: number | null;
  capacity: number | null;
  available_spots: number | null;
  attendees_count: number;
  created_at: string;
  updated_at: string;
  translations: {
    sv: { title: string; description: string; location: string };
    en: { title: string; description: string; location: string };
    tr: { title: string; description: string; location: string };
  };
  is_free: boolean;
  price_display?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = getDateLocale(locale);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      const res = await api.get(`/events/${slug}/`);
      return res.data as EventDetail;
    },
    enabled: !!slug,
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/events/${slug}/register/`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', slug] });
      setIsModalOpen(false);
      setRegisterError('');
    },
    onError: (err: any) => {
      setRegisterError(err.response?.data?.detail || t('registrationError'));
    },
  });

  if (isLoading) return <Loader />;
  if (error || !event) return (
    <div className="container-narrow py-24 text-center text-red-500">
      {t('eventNotFound')}
    </div>
  );

  const lang: SupportedLocale = (locale as SupportedLocale) in event.translations
    ? (locale as SupportedLocale)
    : 'sv';

  const title = event.translations[lang]?.title || event.slug;
  const description = event.translations[lang]?.description || '';
  const location = event.translations[lang]?.location || '';
  const isFree = event.is_free || event.price === 0;
  const isFull = event.available_spots === 0;
  const isPast = new Date(event.date_time) < new Date();

  const handleRegister = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="container-narrow py-24">
      <div className="max-w-4xl mx-auto">
        {event.image && (
          <div className="relative h-96 w-full rounded-xl overflow-hidden mb-8">
            <Image src={event.image} alt={title} fill className="object-cover" />
          </div>
        )}

        <h1 className="text-4xl font-serif mb-4">{title}</h1>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
          <CalendarIcon />
          <span>{format(new Date(event.date_time), 'PPPPp', { locale: dateLocale })}</span>
        </div>

        {location && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
            <MapPinIcon />
            <span>{location}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <CreditCardIcon />
            <span className="font-semibold">
              {isFree ? t('free') : event.price_display || `${event.price} SEK`}
            </span>
          </div>
          {event.capacity && (
            <div className="flex items-center gap-2">
              <UsersIcon />
              <span>{t('spotsLeft', { count: event.available_spots ?? 0 })}</span>
            </div>
          )}
        </div>

        <div
          className="prose dark:prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br/>') }}
        />

        {!isPast && (
          <Button
            onClick={handleRegister}
            variant="primary"
            size="lg"
            disabled={isFull || registerMutation.isPending}
            className="w-full md:w-auto"
          >
            {isFull ? t('eventFull') : registerMutation.isPending ? t('registering') : t('registerNow')}
          </Button>
        )}
        {isPast && <p className="text-gray-500 italic">{t('eventPassed')}</p>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-serif mb-4">{t('confirmRegistration')}</h2>
        <p className="mb-4">{t('confirmRegistrationText', { title })}</p>
        {registerError && <p className="text-red-500 mb-4">{registerError}</p>}
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            {t('cancel')}
          </Button>
          <Button variant="primary" onClick={() => registerMutation.mutate()}>
            {t('confirm')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}