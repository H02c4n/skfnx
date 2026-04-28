'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types';
import { Button } from '../ui/Button';
import  Modal  from '../ui/Modal';
import { AlertTriangleIcon } from '../ui/Icons';

export default function MembershipStatus({ profile }: { profile: User }) {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Check if there's already a pending cancellation request
  const hasPending = profile.cancellation_requests?.some(
    (req: any) => req.status === 'pending'
  );

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/me/cancel-membership/', { reason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setIsModalOpen(false);
      setReason('');
      setErrorMsg(null);
    },
    onError: (error: any) => {
      // Extract meaningful error message from backend
      const backendError =
        error.response?.data?.reason ||
        error.response?.data?.detail ||
        error.response?.data?.message ||
        t('cancelMembershipError');
      setErrorMsg(backendError);
    },
  });

  const handleOpenModal = () => {
    setReason('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  // User is inactive – show message, no cancellation button
  if (!profile.is_active) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h3 className="font-serif text-xl mb-4">{t('membershipStatus')}</h3>
        <p className="text-red-600">{t('inactiveExplanation')}</p>
      </div>
    );
  }

  // User already has a pending cancellation request
  if (hasPending) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h3 className="font-serif text-xl mb-4">{t('membershipStatus')}</h3>
        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
          <AlertTriangleIcon />
          <span className="text-sm">{t('pendingCancellation')}</span>
        </div>
      </div>
    );
  }

  // Active user – show cancel button and modal
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
      <h3 className="font-serif text-xl mb-4">{t('membershipStatus')}</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">{t('status')}</span>
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            {t('active')}
          </span>
        </div>

        <Button variant="outline" onClick={handleOpenModal}>
          {t('cancelMembership')}
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-serif mb-4">{t('confirmCancelMembership')}</h2>
        <p className="mb-4">{t('cancelMembershipWarning')}</p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t('reason')}</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-300"
            placeholder={t('reasonPlaceholder')}
          />
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {errorMsg}
          </div>
        )}

        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            {t('cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={() => cancelMutation.mutate()}
            loading={cancelMutation.isPending}
          >
            {t('confirm')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}