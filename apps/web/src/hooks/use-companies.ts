import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useCompanies(params: { search?: string; page: number; sortBy: string; sortOrder: string }) {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => apiClient.getCompanies(params),
    placeholderData: keepPreviousData,
  });
}
