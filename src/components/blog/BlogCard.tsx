'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { sv, enUS, tr } from 'date-fns/locale';
import Card from '../ui/Card';

const getDateLocale = (locale: string) => {
  switch (locale) {
    case 'sv': return sv;
    case 'en': return enUS;
    case 'tr': return tr;
    default: return sv;
  }
};


const decodeHtml = (html: string): string => {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&auml;/g, 'ä')
    .replace(/&ouml;/g, 'ö')
    .replace(/&aring;/g, 'å')
    .replace(/&Auml;/g, 'Ä')
    .replace(/&Ouml;/g, 'Ö')
    .replace(/&Aring;/g, 'Å')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
};

export default function BlogCard({ post }: { post: any }) {
  const locale = useLocale();
  const dateLocale = getDateLocale(locale);

  const translation = post.translations?.[locale];
  const title = translation?.title || post.slug;
  const content = translation?.content || '';

  const rawText = content.replace(/<[^>]*>/g, '');
  const decoded = decodeHtml(rawText);
  const summary = decoded.substring(0, 150) + (decoded.length > 150 ? '…' : '');

  const categoryName = post.category?.name || '';
  const imageUrl = post.image;

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition mb-2">
        <div className="flex flex-col md:flex-row gap-4">
          {imageUrl && (
            <div className="relative w-full md:w-48 h-48 flex-shrink-0">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover rounded"
                unoptimized // Cloudinary URL is already optimised
              />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-serif font-semibold mb-2">{title}</h2>
            <div className="text-sm text-gray-500 mb-2">
              {format(new Date(post.created_at), 'PPP', { locale: dateLocale })}
              {categoryName && <span> • {categoryName}</span>}
            </div>
            <p className="text-gray-600 dark:text-gray-300">{summary}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}