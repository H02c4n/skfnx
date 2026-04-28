'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import BoardMembersList from '@/components/board/BoardMemberList';
import Loader from '@/components/ui/Loader';
import api from '@/lib/api';

export default function AboutPage() {
  const t = useTranslations();

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get('/settings/');
      return res.data;
    },
  });

  if (settingsLoading) return <Loader />;

  return (
    <div className="container-narrow py-24">
      <h1 className="text-4xl font-serif mb-8">{t('about')}</h1>

      {settings && (settings.mission || settings.vision) && (
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {settings.mission && (
              <Card className="h-full">
                <h2 className="text-2xl font-serif mb-4">{t('mission')}</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {settings.mission}
                </p>
              </Card>
            )}
            {settings.vision && (
              <Card className="h-full">
                <h2 className="text-2xl font-serif mb-4">{t('vision')}</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {settings.vision}
                </p>
              </Card>
            )}
          </div>
        </section>
      )}

      {settings && (
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6">{t('organization')}</h2>
          <Card>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">{t('orgName')}</dt>
                <dd className="font-medium">{settings.organization_name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">{t('orgNumber')}</dt>
                <dd className="font-medium">{settings.org_number}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">{t('email')}</dt>
                <dd className="font-medium">{settings.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">{t('phone')}</dt>
                <dd className="font-medium">{settings.phone}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-gray-500">{t('address')}</dt>
                <dd className="font-medium">{settings.address}</dd>
              </div>
              {settings.founded_year && (
                <div>
                  <dt className="text-sm text-gray-500">{t('founded')}</dt>
                  <dd className="font-medium">{settings.founded_year}</dd>
                </div>
              )}
            </dl>
          </Card>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-serif mb-6">{t('boardOfDirectors')}</h2>
        <BoardMembersList />
      </section>
    </div>
  );
}