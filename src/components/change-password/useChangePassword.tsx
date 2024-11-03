import { ChangePasswordSchema } from '@components/change-password/ChangePassword';
import axios from '@lib/axios';
import { useMutation } from '@tanstack/react-query';

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordSchema) => {
      return axios.patch('/users/change-password', data);
    },
  });
}
