'use client';

import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { sv, enUS, tr } from 'date-fns/locale';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';
import { CalendarIcon, MapPinIcon, UsersIcon, CreditCardIcon } from '@/components/ui/Icons';
import RegisterButton from '@/components/events/RegisterButton';

type SupportedLocale = 'sv' | 'en' | 'tr';

const getDateLocale = (locale: string) => {
  switch (locale) {
    case 'sv': return sv;
    case 'en': return enUS;
    case 'tr': return tr;
    default: return sv;
  }
};

interface RecurrenceRule {
  frequency: string;
  interval: number;
  by_day: string;
  end_date: string | null;
  count: number | null;
}

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
  recurrence_rule?: RecurrenceRule | null;
}

// Upcoming occurrences from calendar API
interface Occurrence {
  date_time: string;
  occurrence_date: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = getDateLocale(locale);
  const [selectedOccurrence, setSelectedOccurrence] = useState<string>('');

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      const res = await api.get(`/events/${slug}/`);
      return res.data as EventDetail;
    },
    enabled: !!slug,
  });

  // Fetch upcoming occurrences for recurring events
  const { data: occurrences } = useQuery({
    queryKey: ['event-occurrences', slug],
    queryFn: async () => {
      const res = await api.get(`/events/calendar/?month=${new Date().toISOString().slice(0, 7)}`);
      // Filter occurrences for this event
      const allOccs: Occurrence[] = [];
      res.data.forEach((day: any) => {
        day.events?.forEach((e: any) => {
          if (e.slug === slug) {
            allOccs.push({ date_time: e.date_time, occurrence_date: e.occurrence_date });
          }
        });
      });
      return allOccs;
    },
    enabled: !!event?.recurrence_rule,
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
  const isRecurring = !!event.recurrence_rule;

  // For recurring: use selected occurrence date, for single: use event date
  const occurrenceDateToSend = isRecurring
    ? selectedOccurrence
    : new Date(event.date_time).toISOString().slice(0, 10);

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
          {isRecurring && (
            <span className="ml-2 text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full">
              {t('recurringEvent')}
            </span>
          )}
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

        {/* Recurring event — occurrence seçimi */}
        {isRecurring && occurrences && occurrences.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {t('selectOccurrence')}
            </label>
            <select
              value={selectedOccurrence}
              onChange={(e) => setSelectedOccurrence(e.target.value)}
              className="w-full md:w-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-300"
            >
              <option value="">{t('chooseDate')}</option>
              {occurrences.map((occ) => (
                <option key={occ.occurrence_date} value={occ.occurrence_date}>
                  {format(new Date(occ.date_time), 'PPPp', { locale: dateLocale })}
                </option>
              ))}
            </select>
          </div>
        )}

        <div
          className="prose dark:prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br/>') }}
        />

        {!isPast && (
          <RegisterButton
            event={event}
            locale={locale}
            occurrenceDate={occurrenceDateToSend}
          />
        )}
        {isPast && <p className="text-gray-500 italic">{t('eventPassed')}</p>}

        {/* Recurring için tarih seçilmeden kayıt uyarısı */}
        {isRecurring && !selectedOccurrence && !isPast && (
          <p className="mt-2 text-sm text-amber-500">{t('selectOccurrenceFirst')}</p>
        )}
      </div>
    </div>
  );
}