import { RetrySchema, VerifySchema } from '@components/verify-form/verify.schema';
import axios from '@lib/axios';
import { IResponse } from '@lib/types';
import { useMutation } from '@tanstack/react-query';
export type CheckcodeRes = IResponse<{
  isBeforeCheck: boolean;
}>;

export type RetryRes = IResponse<{
  _id: string;
}>;

export function useVerify() {
  const verify = useMutation<CheckcodeRes, Error, VerifySchema>({
    mutationFn: async (data) => {
      const res = await axios.post<CheckcodeRes>('/auth/check-code', data);
      return res.data;
    },
  });
  const retry = useMutation<RetryRes, Error, RetrySchema>({
    mutationFn: async (data) => {
      const res = await axios.post<RetryRes>('/auth/retry-active', data);
      return res.data;
    },
  });

  return [verify, retry] as const;
}
