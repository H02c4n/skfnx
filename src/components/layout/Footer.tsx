'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSettings } from '@/hooks/useSettings';
import { FacebookIcon, InstagramIcon, LinkedinIcon, PhoneIcon, MailIcon, MapPinIcon } from '../ui/Icons';

export default function Footer() {
  const t = useTranslations();
  const { settings } = useSettings();

  return (
    <footer className="bg-primary-300 dark:bg-gray-800 pt-12 pb-6 mt-auto">
      <div className="container-narrow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-primary-200 pb-8">
          <div>
            <h3 className="font-serif text-xl mb-4">{settings?.organization_name || 'Kulturföreningen'}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{settings?.short_description}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t('navigation')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events">{t('events')}</Link></li>
              <li><Link href="/blog">{t('blog')}</Link></li>
              <li><Link href="/about">{t('about')}</Link></li>
              <li><Link href="/contact">{t('contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t('contact')}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><MapPinIcon /> {settings?.address || t('defaultAddress')}</li>
              <li className="flex items-center gap-2"><PhoneIcon /> {settings?.phone || t('defaultPhone')}</li>
              <li className="flex items-center gap-2"><MailIcon /> {settings?.email || t('defaultEmail')}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t('followUs')}</h4>
            <div className="flex gap-4">
              {settings?.facebook && <Link href={settings.facebook} target="_blank"><FacebookIcon /></Link>}
              {settings?.instagram && <Link href={settings.instagram} target="_blank"><InstagramIcon /></Link>}
              {settings?.linkedin && <Link href={settings.linkedin} target="_blank"><LinkedinIcon /></Link>}
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-6">
          {t('copyright', { year: new Date().getFullYear(), org: settings?.organization_name || 'Kulturföreningen' })}
        </div>
      </div>
    </footer>
  );
}