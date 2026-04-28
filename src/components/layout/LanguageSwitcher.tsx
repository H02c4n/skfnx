'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchLanguage = (newLocale: string) => {
    // Remove the current locale prefix from the pathname if present
    let newPathname = pathname;
    if (pathname.startsWith(`/${currentLocale}`)) {
      newPathname = pathname.replace(`/${currentLocale}`, '');
    }
    if (newPathname === '') newPathname = '/';
    // Prepend the new locale
    const newUrl = `/${newLocale}${newPathname}`;
    router.push(newUrl);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <div className="flex gap-1">
      <button
        onClick={() => switchLanguage('sv')}
        className={`px-2 py-1 text-sm ${currentLocale === 'sv' ? 'font-bold text-accent-300' : ''}`}
      >
        SV
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-2 py-1 text-sm ${currentLocale === 'en' ? 'font-bold text-accent-300' : ''}`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('tr')}
        className={`px-2 py-1 text-sm ${currentLocale === 'tr' ? 'font-bold text-accent-300' : ''}`}
      >
        TR
      </button>
    </div>
  );
}