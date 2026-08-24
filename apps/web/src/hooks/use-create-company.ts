import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.createCompany,
    onSuccess: () => {
      toast.success('Company created successfully');
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create company');
    }
  });
}
