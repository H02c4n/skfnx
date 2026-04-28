'use client';

import { useTranslations } from 'next-intl';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import BlogCard from '@/components/blog/BlogCard';
import BlogFilters from '@/components/blog/BlogFilters';
import Loader from '@/components/ui/Loader';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export default function BlogPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();

  const filters = {
    category: searchParams.get('category') || '',
    tag: searchParams.get('tag') || '',
    search: searchParams.get('search') || '',
  };

  const {
  data,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery<any, Error, InfiniteData<any>, any, number>({
  queryKey: ['posts', filters],
  queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
    const params = new URLSearchParams({
      page: pageParam.toString(),
      ...(filters.category && { category: filters.category }),
      ...(filters.tag && { tag: filters.tag }),
      ...(filters.search && { search: filters.search }),
    });
    const res = await api.get(`/posts/?${params.toString()}`);
    return res.data;
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage) => {
    if (lastPage.next) {
      const url = new URL(lastPage.next, window.location.origin);
      return Number(url.searchParams.get('page')); // ← string → number
    }
    return undefined;
  },
});

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const allPosts = data?.pages.flatMap((page) => page.results) || [];

  return (
    <div className="container-narrow py-24">
      <h1 className="text-4xl font-serif mb-8">{t('blog')}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <BlogFilters />
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <Loader />
          ) : allPosts.length === 0 ? (
            <p className="text-center text-gray-500 py-12">{t('noPosts')}</p>
          ) : (
            <div className="space-y-6">
              {allPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {hasNextPage && (
            <div ref={ref} className="py-8 flex justify-center">
              {isFetchingNextPage && <Loader />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}