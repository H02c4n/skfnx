'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Loader from '../ui/Loader';
import { MailIcon } from '../ui/Icons';
import { useTranslations } from 'next-intl';

interface BoardMember {
  id: number;
  name: string;
  title: string;
  email: string;
  image: string;
  order: number;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}



export default function BoardSection() {
  const t = useTranslations()
  const { data, isLoading, error } = useQuery({
    queryKey: ['boardMembers'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/board-members/`);
      if (!res.ok) throw new Error('Failed to fetch board members');
      const json = await res.json() as PaginatedResponse<BoardMember>;
      return json.results;
    },
  });

  if (isLoading) return <Loader />;
  if (error) return <p className="text-center text-red-500">Kunde inte ladda styrelsemedlemmar</p>;
  if (!data || data.length === 0) return null;

  return (
    <div>
      <h2 className="text-3xl font-serif text-center mb-12">{t('boardOfDirectors')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.map((member) => (
          <div key={member.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
            <div className="relative h-64 w-full bg-gray-200 dark:bg-gray-700">
              {member.image && (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  unoptimized // if using localhost or external URL without optimization
                />
              )}
            </div>
            <div className="p-5 text-center">
              <h3 className="text-xl font-serif font-semibold">{member.name}</h3>
              <p className="text-accent-300 text-sm mb-2">{member.title}</p>
              <a href={`mailto:${member.email}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent-300">
                <MailIcon />
                {member.email}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}