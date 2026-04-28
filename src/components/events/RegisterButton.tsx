'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Button } from '../ui/Button';
import Modal from '../ui/Modal';
import { useTranslations } from 'next-intl';
import { Event } from '@/types';

type SupportedLocale = 'sv' | 'en' | 'tr';

export default function RegisterButton({ event, locale }: { event: Event; locale: string }) {
  const t = useTranslations('events');
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const isFull = event.capacity != null && (event.attendees_count ?? 0) >= event.capacity;

  const lang: SupportedLocale = (locale as SupportedLocale) in event.translations
    ? (locale as SupportedLocale)
    : 'sv';

  const title = event.translations[lang]?.title || event.slug;

  const registerMutation = useMutation({
    mutationFn: () => api.post(`/events/${event.slug}/register/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', event.slug] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setShowModal(true);
    },
  });

  const handleClick = () => {
    if (!user) {
      router.push(`/${locale}/login?redirect=/events/${event.slug}`);
      return;
    }
    registerMutation.mutate();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isFull || registerMutation.isPending}
        loading={registerMutation.isPending}
        size="lg"
      >
        {isFull ? t('full') : t('register')}
      </Button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-2xl font-serif mb-4">{t('registrationConfirmed')}</h2>
        <p className="mb-6">{t('registrationConfirmedText', { title })}</p>
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => setShowModal(false)}>
            {t('close')}
          </Button>
        </div>
      </Modal>
    </>
  );
}