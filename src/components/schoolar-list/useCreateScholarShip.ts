import { getScholarShipKey } from '@components/schoolar-list/constant';
import { CreateScholarSchema } from '@components/schoolar-list/CreateScholarPanel';
import { useUploadBatchImages } from '@components/upload/useUploadBatchImages';
import axios from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateScholarShip() {
  const client = useQueryClient();
  const { mutateAsync } = useUploadBatchImages();
  return useMutation({
    mutationFn: async (data: CreateScholarSchema) => {
      const results = await mutateAsync(data.image);
      const images = results.map((result) => result.url);

      return axios.post('/scholarship', {
        ...data,
        image: images,
        major: data.major.map((major) => major.text),
        level: data.level.map((level) => level.text),
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: getScholarShipKey.list() });
    },
  });
}
