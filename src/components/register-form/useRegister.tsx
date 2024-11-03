import { RegisterSchema } from '@components/register-form/register.schema';
import axios from '@lib/axios';
import { useMutation } from '@tanstack/react-query';
export type RegisterRes = {
  message: string;
  data: {
    _id: string;
    createdAt: Date;
  };
};

export function useRegister() {
  return useMutation<RegisterRes, Error, RegisterSchema>({
    mutationFn: async (data) => {
      const res = await axios.post<RegisterRes>('/auth/register', data);
      if (res.status === 400) {
        return Promise.reject('Tên đăng nhập hoặc email đã tồn tại');
      }
      return res.data;
    },
  });
}
