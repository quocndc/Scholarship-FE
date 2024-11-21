import { ProfileChangeSchema } from '@components/profile-change/ProfileChange';
import { useUpdateUser, useUser } from '@lib/auth';
import axios from '@lib/axios';
import { useMutation } from '@tanstack/react-query';

export function useUpdateProfile() {
  const updateUser = useUpdateUser();
  const user = useUser();
  return useMutation({
    mutationFn: async (data: ProfileChangeSchema) => {
      return axios.patch('/users', {
        ...data,
        id: user?._id,
      });
    },
    onSuccess: (_, data) => {
      updateUser(data);
    },
  });
}
