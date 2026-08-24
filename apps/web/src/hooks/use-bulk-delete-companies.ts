import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export function useBulkDeleteCompanies() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Execute deletions concurrently for simplicity while complying with single-item API spec
      await Promise.all(ids.map((id) => apiClient.deleteCompany(id)));
    },
    onSuccess: (data, variables) => {
      toast.success(`Successfully deleted ${variables.length} companies`);
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete companies');
    },
  });
}
