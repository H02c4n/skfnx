'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import EventGrid from '@/components/events/EventGrid';
import EventFilters from '@/components/events/EventFilters';
import Loader from '@/components/ui/Loader';
import { Event } from '@/types';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export default function EventsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [filters, setFilters] = useState({
    search: '',
    year: '',
    price: '',
    page: 1,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['events', filters, locale],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.year) {
        // Send date range for the selected year
        params.append('date_time__gte', `${filters.year}-01-01`);
        params.append('date_time__lte', `${filters.year}-12-31`);
      }
      if (filters.price === 'free') params.append('price', '0');
      params.append('page', String(filters.page));
      const res = await api.get(`/events/?${params.toString()}`);
      return res.data as PaginatedResponse<Event>;
    },
  });

  return (
    <div className="container-narrow py-24">
      <h1 className="text-4xl font-serif mb-8">{t('events')}</h1>
      <EventFilters filters={filters} setFilters={setFilters} />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-center text-red-500">{t('error')}</p>
      ) : !data?.results?.length ? (
        <p className="text-center text-gray-500">{t('noEvents')}</p>
      ) : (
        <>
          <EventGrid events={data.results} />
          <div className="flex justify-center gap-4 mt-12">
            <button
              onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
              disabled={!data.previous}
              className="px-4 py-2 rounded bg-primary-200 disabled:opacity-50"
            >
              {t('previous')}
            </button>
            <span className="px-4 py-2">{t('page')} {filters.page}</span>
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={!data.next}
              className="px-4 py-2 rounded bg-primary-200 disabled:opacity-50"
            >
              {t('next')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}