import { getUserKey } from '@components/user-list/constants';
import axios from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => axios.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserKey.list(),
      });
    },
  });
}
