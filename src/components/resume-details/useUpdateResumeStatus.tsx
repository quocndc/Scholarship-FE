import { UpdateResumeStatusSchema } from '@components/resume-details/ResumeUpdateStatusPanel';
import { getResumeKey } from '@components/resume-list';
import axios from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateResumeStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateResumeStatusSchema) => axios.patch(`/resumes/${data.id}`, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: getResumeKey.list() });
    },
  });
}
