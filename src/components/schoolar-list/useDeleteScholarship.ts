import { getScholarShipKey } from '@components/schoolar-list/constant';
import axios from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteScholarship() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axios.delete(`/scholarship/${id}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: getScholarShipKey.list() });
    },
  });
}
