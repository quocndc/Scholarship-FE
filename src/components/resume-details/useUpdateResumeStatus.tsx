import { getResumeKey } from '@components/resume-list';
import axios from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateResumeStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; status?: string; urlCv: File | null }) => {
      const formData = new FormData();
      data.status && formData.append('status', data.status);
      data.urlCv && formData.append('urlCV', data.urlCv);
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
