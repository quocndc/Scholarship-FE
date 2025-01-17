import { getProviderKey } from '@components/provider-list/constants';
import { CreateProviderSchema } from '@components/provider-list/CreateProviderPanel';
import { useUploadImage } from '@components/upload/useUploadImage';
import axios from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateProvider() {
  const client = useQueryClient();
  const { mutateAsync } = useUploadImage();
  return useMutation({
    mutationFn: async (data: CreateProviderSchema) => {
      const willUploadLogo = data.logo instanceof File;
      const willUploadBackground = data.background instanceof File;
      const background = willUploadBackground ? await mutateAsync(data.background as File).then((res) => res.url) : data.background;
      const logo = willUploadLogo ? await mutateAsync(data.logo as File).then((res) => res.url) : data.logo;
      if (data._id) {
        return axios.patch(`/providers/${data._id}`, {
          ...data,
          background: background,
          logo,
        });
      }
      return axios.post('/providers', {
        ...data,
        background: background,
        logo,
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: getProviderKey.list() });
    },
  });
}
