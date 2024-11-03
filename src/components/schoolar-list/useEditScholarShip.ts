import { getScholarShipKey } from '@components/schoolar-list/constant';
import { CreateScholarSchema } from '@components/schoolar-list/CreateScholarPanel';
import { useUploadBatchImages } from '@components/upload/useUploadBatchImages';
import axios from '@lib/axios';
import { SchoolarShip } from '@lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useEditScholarship() {
  const client = useQueryClient();
  const { mutateAsync } = useUploadBatchImages();
  return useMutation({
    mutationFn: async ({ data, old }: { data: CreateScholarSchema; old: SchoolarShip }) => {
      const diffImages = data.image.filter((image) => !old.image.includes(image.name));
      if (diffImages.length > 0) {
        const results = await mutateAsync(diffImages);
        const images = results.map((result) => result.url);

        return axios.patch(`/scholarship/${data._id}`, {
          ...data,
          image: images,
        });
      }
      return axios.patch(`/scholarship/${data._id}`, {
        ...data,
        image: old.image,
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: getScholarShipKey.list() });
    },
  });
}
