import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { format } from 'date-fns';
import { sv, enUS, tr } from 'date-fns/locale';
import Card from '@/components/ui/Card';
import { CalendarIcon, TagIcon, FolderIcon } from '@/components/ui/Icons';

const getDateLocale = (locale: string) => {
  switch (locale) {
    case 'sv': return sv;
    case 'en': return enUS;
    case 'tr': return tr;
    default: return sv;
  }
};

async function getPost(slug: string, locale: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}/`, {
    next: { revalidate: 3600 },
    headers: { 'Accept-Language': locale },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const t = await getTranslations();
  const post = await getPost(params.slug, params.locale);
  if (!post) notFound();

  const dateLocale = getDateLocale(params.locale);
  const translation = post.translations?.[params.locale];
  const title = translation?.title || post.slug;
  const content = translation?.content || '';
  const categoryName = post.category?.name || '';
  const tags = post.tags || [];
  const imageUrl = post.image;

  // Helper to get tag name for current locale
  const getTagName = (tag: any) => {
    const tagTranslation = tag.translations?.[params.locale];
    if (tagTranslation && typeof tagTranslation === 'object' && 'name' in tagTranslation) {
      return tagTranslation.name;
    }
    // Fallback to slug if translation missing
    return tag.slug;
  };

  console.log(getTagName);

  return (
    <div className="container-narrow py-24">
      <article className="max-w-3xl mx-auto">
        {imageUrl && (
          <div className="relative h-96 w-full rounded-xl overflow-hidden mb-8">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              unoptimized={false}
            />
          </div>
        )}

        <h1 className="text-4xl font-serif mb-4">{title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-8">
          <div className="flex items-center gap-1">
            <CalendarIcon />
            <span>{format(new Date(post.created_at), 'PPP', { locale: dateLocale })}</span>
          </div>
          {categoryName && (
            <div className="flex items-center gap-1">
              <FolderIcon />
              <span>{categoryName}</span>
            </div>
          )}
          {tags.length > 0 && (
            <div className="flex items-center gap-1">
              <TagIcon />
              <span>
                {tags.map(getTagName).join(', ')}
              </span>
            </div>
          )}
        </div>

        <Card>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Card>
      </article>
    </div>
  );
}