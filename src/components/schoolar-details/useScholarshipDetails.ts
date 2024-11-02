import axios from '@lib/axios';
import { SchoolarShip } from '@lib/types';
import { useQuery } from '@tanstack/react-query';

export function useScholarshipDetails({ id }: { id: string }) {
  return useQuery<SchoolarShip>({
    queryKey: ['scholarship-details', id],
    queryFn: () => axios.get<SchoolarShip>(`/scholarship/${id}`).then((d) => d.data),
  });
}
