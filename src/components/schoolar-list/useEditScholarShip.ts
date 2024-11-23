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
    mutationFn: async ({ data }: { data: CreateScholarSchema; old: SchoolarShip }) => {
      const imagesToUpload = data.image.filter((i) => i instanceof File);
      const images = data.image.filter((i) => !(i instanceof File));
      if (imagesToUpload.length > 0) {
        const res = await mutateAsync(imagesToUpload);
        images.push(...res.map((r) => r.url));
      }

      return axios.patch(`/scholarship/${data._id}`, {
        ...data,
        image: images,
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: getScholarShipKey.list() });
    },
  });
}
