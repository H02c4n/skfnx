'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations, useLocale } from 'next-intl';
import api from '@/lib/api';
import { format } from 'date-fns';
import { sv, enUS, tr } from 'date-fns/locale';
import Link from 'next/link';
import { ClockIcon, CreditCardIcon } from '../ui/Icons';

// Map app locale to date-fns locale
const getDateFnsLocale = (locale: string) => {
  switch (locale) {
    case 'sv': return sv;
    case 'en': return enUS;
    case 'tr': return tr;
    default: return sv;
  }
};

export default function CalendarPreview() {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);

  const { data, isLoading } = useQuery({
    queryKey: ['calendarEvents', locale],
    queryFn: async () => {
      const res = await api.get('/events/calendar/');
      return res.data as { date: string; events: any[] }[];
    },
  });

  if (isLoading) return <div className="text-center">{t('loadingCalendar')}</div>;
  if (!data?.length) return null;

  const upcomingDates = data.slice(0, 4);

  return (
    <div>
      <h2 className="text-3xl font-serif text-center mb-8">{t('eventCalendar')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {upcomingDates.map((day) => (
          <div key={day.date} className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm">
            <h3 className="text-xl font-semibold mb-3 border-l-4 border-accent-300 pl-3">
              {format(new Date(day.date), 'EEEE d MMMM', { locale: dateLocale })}
            </h3>
            <ul className="space-y-2">
              {day.events.map((ev) => {
                // Get title in current language from translations object (if available)
                const title = ev.translations?.[locale]?.title || ev.title || ev.slug;
                return (
                  <li key={ev.id} className="flex justify-between items-center">
                    <Link href={`/events/${ev.slug}`} className="hover:text-accent-300">
                      {title}
                    </Link>
                    <span className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <ClockIcon />
                        {ev.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCardIcon />
                        {ev.price === 0 || ev.price === '0.00' || !ev.price
                          ? t('free')
                          : `${ev.price} SEK`}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link href="/events" className="text-accent-300 hover:underline">{t('viewAllEvents')} →</Link>
      </div>
    </div>
  );
}