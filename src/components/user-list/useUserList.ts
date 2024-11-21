import { getUserKey } from '@components/user-list/constants';
import axios from '@lib/axios';
import { IPagedRequest, IPagedResponse, User } from '@lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import queryString from 'query-string';
const initialRequest: IPagedRequest = {
  current: 1,
  pageSize: 30,
};
type UseUserListProps = {
  filter?: Record<string, any>;
};
export function useUserList({ filter }: UseUserListProps) {
  return useInfiniteQuery({
    queryKey: getUserKey.list(filter),
    queryFn: ({ pageParam }) => {
      const paramsObj = {
        ...initialRequest,
        ...filter,
        current: pageParam,
        name: filter?.name && new RegExp(filter.name, 'i'),
        email: filter?.email && new RegExp(filter.email, 'i'),
        phone: filter?.phone && new RegExp(filter.phone, 'i'),
        address: filter?.address && new RegExp(filter.address, 'i'),
      };
      const qs = queryString.stringify(paramsObj, {
        skipEmptyString: true,
        arrayFormat: 'separator',
      });
      return axios.get<IPagedResponse<User>>(`/users?${qs}`).then((d) => d.data);
    },
    initialPageParam: initialRequest.current,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.meta.current >= lastPage.data.meta.pages) return undefined;
      return lastPage.data.meta.current + 1;
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.data.meta.current <= 1) return undefined;
      return firstPage.data.meta.current - 1;
    },
  });
}
