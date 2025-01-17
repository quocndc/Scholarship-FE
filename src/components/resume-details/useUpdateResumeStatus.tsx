import { UpdateResumeStatusSchema } from '@components/resume-details/ResumeUpdateStatusPanel';
import { getResumeKey } from '@components/resume-list';
import axios from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateResumeStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateResumeStatusSchema) => {
      const formData = new FormData();
      data.status && formData.append('status', data.status);
      data.urlCv && formData.append('urlCV', data.urlCv);
      data.note && formData.append('note', data.note);
      return axios.patch(`/resumes/${data.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: getResumeKey.list() });
    },
  });
}
