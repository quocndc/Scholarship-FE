import { UploadCVSchema } from '@components/upload-cv/UploadCVDialog';
import axios from '@lib/axios';
import { IResponse, PaymentLink } from '@lib/types';
import { useMutation } from '@tanstack/react-query';

export function useUploadCV() {
  return useMutation({
    mutationFn: (data: UploadCVSchema) => {
      const formData = new FormData();
      formData.append('scholarship', data.scholarship);
      formData.append('urlCV', data.urlCv);

      return axios
        .post<
          IResponse<{
            _id: string;
            createdAt: string;
            payment: PaymentLink;
          }>
        >('/resumes', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => res.data.data);
    },
  });
}
