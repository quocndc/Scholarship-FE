import { getResumeProvKey } from '@components/resume-prov-list/constants';
import axios from '@lib/axios';
import { IPagedRequest, IPagedResponse, ResumeProv } from '@lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import queryString from 'query-string';
const initialRequest: IPagedRequest = {
  current: 1,
  pageSize: 30,
};
type UseUserListProps = {
  filter?: Record<string, any>;
};
export function useResumeProvList({ filter }: UseUserListProps) {
  return useInfiniteQuery({
    queryKey: getResumeProvKey.list(filter),
    queryFn: ({ pageParam }) => {
      const paramsObj = {
        ...initialRequest,
        current: pageParam,
        status: filter?.status && new RegExp(filter.status, 'i'),
        name: filter?.name && new RegExp(filter.name, 'i'),
        email: filter?.email && new RegExp(filter.email, 'i'),
        // provider: filter?.provider,
        'scholarProv._id': filter?.scholarship,
        populate: ['scholarProv'],
        fields: ['scholarProv.name'],
      };
      const qs = queryString.stringify(paramsObj, {
        skipEmptyString: true,
      });
      return axios.get<IPagedResponse<ResumeProv>>(`/resume-prov?${qs}`).then((d) => d.data);
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
