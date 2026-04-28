'use client';

import { useTranslations } from 'next-intl';
import { useSettings } from '@/hooks/useSettings';
import Loader from '../ui/Loader';

export default function AboutPreview() {
  const t = useTranslations();
  const { settings, isLoading, error } = useSettings();

  if (isLoading) return <Loader />;
  if (error) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h2 className="text-2xl font-serif mb-4">{t('mission')}</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {settings?.mission || t('missionFallback')}
        </p>
      </div>
      <div>
        <h2 className="text-2xl font-serif mb-4">{t('vision')}</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {settings?.vision || t('visionFallback')}
        </p>
      </div>
    </div>
  );
}