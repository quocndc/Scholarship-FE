import axios from '@lib/axios';
import { IResponse } from '@lib/types';
import { useMutation } from '@tanstack/react-query';
export type IFileUpload = {
  tags: [];
  public_id: string;
  version: number;
  url: string;
};
export function useUploadImage(onSuccess?: (data: IFileUpload) => void) {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      return axios
        .post<FormData, { data: IResponse<IFileUpload> }>('/files/image', formData, {
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
