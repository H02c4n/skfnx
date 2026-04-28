'use client';

import { useTranslations } from 'next-intl';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const t = useTranslations();
  const { settings } = useSettings();

  // Construct image URL safely
  const getImageUrl = () => {
    if (!settings?.hero_background) return null;
    if (settings.hero_background.startsWith('http')) return settings.hero_background;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
    if (!baseUrl) return null;
    const path = settings.hero_background.startsWith('/') ? settings.hero_background : `/${settings.hero_background}`;
    return `${baseUrl}${path}`;
  };

  const heroImageUrl = getImageUrl();
  const hasCustomImage = !!heroImageUrl;

  return (
    <div className="relative min-h-[85vh] w-full">
      {/* Always render the image (if available) */}
      {hasCustomImage && (
        <Image
          src={heroImageUrl}
          alt="Hero background"
          fill
          priority
          className="object-cover object-[center_90%] md:object-[center_70%]"
          sizes="100vw"
          quality={85}
        />
      )}

      {/* Only show overlay + text when NO custom image is provided */}
      {!hasCustomImage && (
        <>
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 flex items-center justify-center min-h-[85vh] container-narrow text-center text-white animate-fade-in">
            <div>
              <h1 className="text-4xl md:text-6xl font-serif mb-4">
                {settings?.organization_name || 'Kulturföreningen'}
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8">
                {settings?.short_description}
              </p>
              <Link href="/events">
                <Button variant="primary" size="lg">{t('viewEvents')}</Button>
              </Link>
            </div>
          </div>
        </>
      )}

      {/* If no custom image, also show a default background color/fallback image */}
      {!hasCustomImage && (
        <div
          className="absolute inset-0 bg-cover bg-center -z-10"
          style={{ backgroundImage: `url('/hero-bg.jpg')` }}
        />
      )}
    </div>
  );
}