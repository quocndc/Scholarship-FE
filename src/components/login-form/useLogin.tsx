import { LoginSchema } from '@components/login-form/login.schema';
import { useStateLogin } from '@lib/auth';
import axios from '@lib/axios';
import { User } from '@lib/types';
import { useMutation } from '@tanstack/react-query';
export type LoginRes = {
  message: string;
  data: {
    access_token: string;
    user: User;
  };
};

export function useLogin() {
  const stateLogin = useStateLogin();
  return useMutation<LoginRes, Error, LoginSchema>({
    mutationFn: async (data) => {
      const res = await axios.post<LoginRes>('/auth/login', data);
      if ((res.status <= 299 || res.status >= 200) && data.save) {
        stateLogin(res.data.data);
      }
      return res.data;
    },
  });
}
