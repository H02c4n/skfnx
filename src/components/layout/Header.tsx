'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from '../ui/ThemeToggle';
import { MenuIcon, CloseIcon } from '../ui/Icons';

const navItems = [
  { key: 'home', href: '/' },
  { key: 'events', href: '/events' },
  { key: 'blog', href: '/blog' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { settings, isLoading: settingsLoading } = useSettings();
  const t = useTranslations();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Construct logo URL safely
  const getLogoUrl = () => {
    if (!settings?.logo) return null;
    // If logo is already an absolute URL, use it directly
    if (settings.logo.startsWith('http://') || settings.logo.startsWith('https://')) {
      return settings.logo;
    }
    // Otherwise prepend API base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
    if (!baseUrl) return null;
    const logoPath = settings.logo.startsWith('/') ? settings.logo : `/${settings.logo}`;
    return `${baseUrl}${logoPath}`;
  };

  const logoUrl = getLogoUrl();
  const isValidLogo = logoUrl && logoUrl.startsWith('http');

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary-300/95 backdrop-blur-sm shadow-md' : 'bg-primary-300'
      } dark:bg-gray-800/95`}
    >
      <div className="container-narrow flex items-center justify-between h-20">
        <Link href="/" className="flex items-center">
          {!settingsLoading && isValidLogo ? (
            <Image
              src={logoUrl}
              alt={settings?.organization_name || 'Logo'}
              width={120}
              height={40}
              className="object-contain"
              priority
              unoptimized={logoUrl.includes('localhost')} // optional for local dev
            />
          ) : (
            <span className="text-2xl font-serif font-semibold text-gray-800 dark:text-white">
              S<span className="text-accent-300">K</span>F
            </span>
          )}
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`hover:text-accent-300 transition ${
                pathname === item.href ? 'text-accent-300 font-medium' : ''
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="hover:text-accent-300">
                {t('dashboard')}
              </Link>
              <button
                onClick={logout}
                className="text-sm px-4 py-2 rounded-full bg-white/20 hover:bg-white/30"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-full border border-white/40 hover:bg-white/10"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30"
              >
                {t('register')}
              </Link>
            </div>
          )}
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-300 dark:bg-gray-800 py-4 px-5 shadow-lg">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-accent-300 py-2"
              >
                {t(item.key)}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  {t('dashboard')}
                </Link>
                <button onClick={logout}>{t('logout')}</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  {t('login')}
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  {t('register')}
                </Link>
              </>
            )}
            <div className="flex justify-between pt-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}