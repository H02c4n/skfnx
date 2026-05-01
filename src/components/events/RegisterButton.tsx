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

export default function RegisterButton({ 
  event, 
  locale,
  occurrenceDate,
}: { 
  event: Event; 
  locale: string;
  occurrenceDate?: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false); // ← onay modalı
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ← başarı modalı
  const [error, setError] = useState('');

  const isFull = event.capacity != null && (event.attendees_count ?? 0) >= event.capacity;

  const lang: SupportedLocale = (locale as SupportedLocale) in event.translations
    ? (locale as SupportedLocale)
    : 'sv';

  const title = event.translations[lang]?.title || event.slug;

  const registerMutation = useMutation({
    mutationFn: () => {
      const body: Record<string, string> = {};
      if (occurrenceDate) body.occurrence_date = occurrenceDate;
      return api.post(`/events/${event.slug}/register/`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', event.slug] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setError('');
      setShowConfirmModal(false);
      setShowSuccessModal(true); // ← onay kapanır, başarı açılır
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || t('registrationError'));
    },
  });

  const handleClick = () => {
    if (!user) {
      router.push(`/${locale}/login?redirect=/events/${event.slug}`);
      return;
    }
    setShowConfirmModal(true); // ← sadece modalı aç, mutation YOK
  };

  const handleConfirm = () => {
    registerMutation.mutate(); // ← onay butonuna basınca mutation
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isFull || registerMutation.isPending}
        loading={registerMutation.isPending}
        size="lg"
      >
        {isFull ? t('eventFull') : t('registerNow')}
      </Button>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {/* Onay Modalı */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <h2 className="text-2xl font-serif mb-4">{t('confirmRegistration')}</h2>
        <p className="mb-4">{t('confirmRegistrationText', { title })}</p>
        {occurrenceDate && (
          <p className="mb-4 text-sm text-gray-500">
            {t('occurrenceDate')}: {occurrenceDate}
          </p>
        )}
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
            {t('cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            loading={registerMutation.isPending}
            disabled={registerMutation.isPending}
          >
            {t('confirm')}
          </Button>
        </div>
      </Modal>

      {/* Başarı Modalı */}
      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <h2 className="text-2xl font-serif mb-4">{t('registrationConfirmed')}</h2>
        <p className="mb-6">{t('registrationConfirmedText', { title })}</p>
        {occurrenceDate && (
          <p className="mb-4 text-sm text-gray-500">
            {t('occurrenceDate')}: {occurrenceDate}
          </p>
        )}
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            {t('close')}
          </Button>
        </div>
      </Modal>
    </>
  );
}