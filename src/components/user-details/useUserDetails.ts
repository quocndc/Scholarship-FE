import { getUserKey } from '@components/user-list';
import axios from '@lib/axios';
import { IResponse, User } from '@lib/types';
import { useQuery } from '@tanstack/react-query';

type Options = {
  enabled?: boolean;
};
export function useUserDetails(id: string, option: Options = {}) {
  return useQuery({
    queryKey: getUserKey.id(id),
    queryFn: () => axios.get<IResponse<User>>(`/users/${id}`).then((d) => d.data.data),
    ...option,
  });
}
