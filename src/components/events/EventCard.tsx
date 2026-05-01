'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { sv, enUS, tr } from 'date-fns/locale';
import { Event } from '@/types';
import { CalendarIcon, MapPinIcon } from '../ui/Icons';
import { CreditCardIcon } from '../ui/Icons';

type SupportedLocale = 'sv' | 'en' | 'tr';

const getDateLocale = (locale: string) => {
  switch (locale) {
    case 'sv': return sv;
    case 'en': return enUS;
    case 'tr': return tr;
    default: return sv;
  }
};

// Hem normal Event hem de EventOccurrence kabul edebilmek için
interface EventOrOccurrence {
  id: number;
  slug: string;
  image: string | null;
  date_time: string;
  price?: number | null;
  price_display?: string;
  capacity?: number | null;
  attendees_count?: number;
  is_free?: boolean;
  occurrence_date?: string; // recurring için
  translations: {
    sv: { title: string; description?: string; location: string };
    en: { title: string; description?: string; location: string };
    tr: { title: string; description?: string; location: string };
  };
}

export default function EventCard({ event }: { event: EventOrOccurrence }) {
  const locale = useLocale();
  const dateLocale = getDateLocale(locale);
  const t = useTranslations();

  const lang: SupportedLocale = (locale as SupportedLocale) in event.translations
    ? (locale as SupportedLocale)
    : 'sv';

  const title = event.translations[lang]?.title || event.slug;
  const location = event.translations[lang]?.location || '';
  const isFree = event.is_free || event.price === 0 || event.price === null || Number(event.price) === 0;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-56 w-full bg-gray-200 dark:bg-gray-700">
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
        {isFree && (
          <span className="absolute top-3 right-3 bg-accent-300 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            {t('free')}  {/* ← price_display yerine */}
          </span>
        )}
        {event.occurrence_date && (
          <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            🔁
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-serif font-semibold mb-2 line-clamp-2">{title}</h3>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-2">
          <CalendarIcon />
          <span>{format(new Date(event.date_time), 'PPP', { locale: dateLocale })}</span>
        </div>
        {location && (
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-3">
            <MapPinIcon />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="font-semibold flex items-center gap-1">
            <CreditCardIcon />
            {Number(event.price) === 0 || event.price === null
              ? t('free')
              : `${event.price} SEK`}
          </span>
          <span className="text-sm text-primary-600 group-hover:underline">{t('readMore')} →</span>
        </div>
      </div>
    </Link>
  );
}