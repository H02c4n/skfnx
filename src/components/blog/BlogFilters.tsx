'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../ui/Input';

export default function BlogFilters() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-lg mb-2">{t('search')}</h3>
        <Input
          placeholder={t('searchPosts')}
          defaultValue={searchParams.get('search') || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
      </div>
      {/* Add category/tag dropdowns later if needed */}
    </div>
  );
}