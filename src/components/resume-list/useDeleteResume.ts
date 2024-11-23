import { getResumeKey } from '@components/resume-list/constants';
import axios from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => axios.delete(`/resumes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getResumeKey.list(),
      });
    },
  });
}
