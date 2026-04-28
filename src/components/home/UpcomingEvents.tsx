'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useUpcomingEvents } from '@/hooks/useEvents';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { sv, enUS, tr } from 'date-fns/locale';
import Loader from '../ui/Loader';
import { CalendarIcon } from '../ui/Icons';

const getLocale = (locale: string) => {
  switch (locale) {
    case 'sv': return sv;
    case 'en': return enUS;
    case 'tr': return tr;
    default: return sv;
  }
};

export default function UpcomingEvents() {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = getLocale(locale);
  const { data, isLoading, error } = useUpcomingEvents();

  if (isLoading) return <Loader />;
  if (error) {
    console.error(error);
    return <p className="text-center text-red-500">{t('error')}</p>;
  }
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">{t('noUpcomingEvents')}</p>;
  }

  return (
    <div>
      <h2 className="text-3xl font-serif text-center mb-12">{t('upcomingEvents')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((event: any) => {
          // Correctly pick the title for the current locale
          const title = event.translations?.[locale]?.title || event.title || event.slug;
          return (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <CalendarIcon />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-xl font-serif font-semibold mb-2 line-clamp-2">
                  {title}
                </h3>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-3">
                  <CalendarIcon />
                  <span>{format(new Date(event.date_time), 'PPP', { locale: dateLocale })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{event.price_display}</span>
                  <span className="text-sm text-primary-600 group-hover:underline">{t('readMore')} →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}