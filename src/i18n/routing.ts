import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['sv', 'en', 'tr'],
  defaultLocale: 'sv',
  localePrefix: 'as-needed'
});