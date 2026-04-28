import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { SiteSettings } from '@/types';

export const useSettings = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get('/settings/');
      return res.data as SiteSettings;
    },
  });
  return { settings: data, isLoading, error };
};