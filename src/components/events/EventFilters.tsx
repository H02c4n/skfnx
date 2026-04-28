'use client';

import { useTranslations } from 'next-intl';
import { Input } from '../ui/Input';

export default function EventFilters({ filters, setFilters }: any) {
  const t = useTranslations();
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Input
        placeholder={t('searchEvents')}
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
        className="flex-1 min-w-[200px]"
      />
      <select
        value={filters.year}
        onChange={(e) => setFilters({ ...filters, year: e.target.value, page: 1 })}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
      >
        <option value="">{t('allDates')}</option>
        <option value="2025">2025</option>
        <option value="2026">2026</option>
        <option value="2027">2027</option>
      </select>
      <select
        value={filters.price}
        onChange={(e) => setFilters({ ...filters, price: e.target.value, page: 1 })}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
      >
        <option value="">{t('allPrices')}</option>
        <option value="free">{t('free')}</option>
        <option value="paid">{t('paid')}</option>
      </select>
    </div>
  );
}