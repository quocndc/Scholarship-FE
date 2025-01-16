import axios from '@lib/axios';
import { IResponse, PaymentLink } from '@lib/types';
import { useQuery } from '@tanstack/react-query';

function useGetResumePayment(
  id: string,
  {
    enabled = true,
  }: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ['resume-payment', id],
    queryFn: async () => {
      return axios.get<IResponse<PaymentLink>>(`/resumes/${id}/payment`);
    },
    enabled,
  });
}
export default useGetResumePayment;
