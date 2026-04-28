'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import api from '@/lib/api';
import { format } from 'date-fns';
import { sv, enUS, tr } from 'date-fns/locale';
import { CalendarIcon } from '../ui/Icons';
import { Button } from '../ui/Button';

const getDateLocale = (locale: string) => {
  switch (locale) {
    case 'sv': return sv;
    case 'en': return enUS;
    case 'tr': return tr;
    default: return sv;
  }
};

export default function RegisteredEvents() {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = getDateLocale(locale);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['registeredEvents'],
    queryFn: async () => {
      const res = await api.get('/me/events/');
      const events = res.data.results || [];
      const now = new Date();
      // Filter out past events
      return events.filter((event: any) => new Date(event.date_time) >= now);
    },
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['registeredEvents'] });
    refetch();
  };

  if (isLoading) return <div className="text-center py-4">{t('loading')}</div>;
  if (error) return <div className="text-red-500 py-4">{t('error')}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-serif text-xl">{t('myEvents')}</h3>
        <Button variant="outline" size="sm" onClick={refresh}>
          {t('refresh')}
        </Button>
      </div>

      {!data || data.length === 0 ? (
        <p className="text-gray-500">{t('noRegisteredEvents')}</p>
      ) : (
        <div className="space-y-3">
          {data.map((event: any) => {
            const title = event.translations?.[locale]?.title || event.title || event.slug;
            return (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="block border-b border-gray-100 dark:border-gray-700 pb-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition"
              >
                <div className="font-medium">{title}</div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <CalendarIcon />
                  <span>
                    {format(new Date(event.date_time), 'PPP', { locale: dateLocale })}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}