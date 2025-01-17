import { getResumeProvKey } from '@components/resume-prov-list/constants';
import axios from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteProvResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => axios.delete(`/resume-prov/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getResumeProvKey.list(),
      });
    },
  });
}
