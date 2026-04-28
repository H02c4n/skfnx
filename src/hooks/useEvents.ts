import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Event } from '@/types';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const useUpcomingEvents = () => {
  return useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      const res = await api.get('/events/upcoming/');
      // The API returns paginated response, extract results
      const data = res.data as PaginatedResponse<Event>;
      return data.results;
    },
  });
};