import { AdvisorSchema } from '@components/AdvisorContactDialog';
import axios from '@lib/axios';
import { useMutation } from '@tanstack/react-query';

export function useCreateAdvisory() {
  return useMutation({
    mutationFn: async (data: AdvisorSchema) => axios.post('/advisory', data),
  });
}
