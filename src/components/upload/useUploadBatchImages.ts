import { IFileUpload } from '@components/upload/useUploadImage';
import axios from '@lib/axios';
import { IResponse } from '@lib/types';
import { useMutation } from '@tanstack/react-query';

export function useUploadBatchImages(onSuccess?: (data: IFileUpload[]) => void) {
  return useMutation({
    mutationFn: async (file: File[]) => {
      const formData = new FormData();

      file.forEach((f) => {
        formData.append('files', f);
      });

      return axios
        .post<FormData, { data: IResponse<IFileUpload[]> }>('/files/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(({ data }) => data.data);
    },
    onSuccess(data) {
      onSuccess?.(data);
    },
  });
}
