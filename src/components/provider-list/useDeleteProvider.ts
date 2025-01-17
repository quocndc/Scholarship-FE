import { getProviderKey } from '@components/provider-list/constants';
import axios from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => axios.delete(`/providers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProviderKey.list(),
      });
    },
  });
}
