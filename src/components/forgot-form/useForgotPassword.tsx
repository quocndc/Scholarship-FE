import { ForgotPasswordSchema } from '@components/forgot-form/forgotPassword.schema';
import { RetrySchema } from '@components/verify-form/verify.schema';
import axios from '@lib/axios';
import { IResponse } from '@lib/types';
import { useMutation } from '@tanstack/react-query';
export type ResetPasswordRes = IResponse<{
  _id: string;
  email: string;
}>;

export type ChangePasswordRes = IResponse<{
  isBeforeCheck: boolean;
}>;

export function useForgotPassword() {
  const changePassword = useMutation<ChangePasswordRes, Error, ForgotPasswordSchema>({
    mutationFn: async (data) => {
      const res = await axios.post<ChangePasswordRes>('/auth/forgot-password', data);
      return res.data;
    },
  });
  const reset = useMutation<ResetPasswordRes, Error, RetrySchema>({
    mutationFn: async (data) => {
      const res = await axios.post<ResetPasswordRes>('/auth/retry-password', data);
      return res.data;
    },
  });

  return [reset, changePassword] as const;
}
