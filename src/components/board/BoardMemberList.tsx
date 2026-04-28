'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

interface BoardMember {
  id: number;
  name: string;
  title: string;
  email: string;
  image: string | null;
  order: number;
}

export default function BoardMembersList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['boardMembers'],
    queryFn: async () => {
      const res = await api.get('/board-members/');
      // API returns paginated response { results: [...] }
      return res.data.results as BoardMember[];
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Laddar styrelsemedlemmar...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Kunde inte ladda styrelsen.</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8">Inga styrelsemedlemmar hittades.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {data.map((member) => (
        <Card key={member.id} className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            {member.image ? (
              <ImageWithFallback
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                sizes="128px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                👤
              </div>
            )}
          </div>
          <h3 className="font-semibold text-lg">{member.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{member.title}</p>
        </Card>
      ))}
    </div>
  );
}