import { getResumeKey } from '@components/resume-list/constants';
import axios from '@lib/axios';
import { IPagedRequest, IPagedResponse, Resume, SchoolarShip } from '@lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import queryString from 'query-string';
const initialRequest: IPagedRequest = {
  current: 1,
  pageSize: 30,
};
type UseUserListProps = {
  filter?: Record<string, string>;
};
export function useResumeList({ filter }: UseUserListProps) {
  return useInfiniteQuery({
    queryKey: getResumeKey.list(filter),
    queryFn: ({ pageParam }) => {
      const paramsObj = {
        ...initialRequest,
        ...filter,
        current: pageParam,
        status: filter?.status && new RegExp(filter.status, 'i'),
        'scholarship._id': filter?.scholarship,
        populate: 'scholarship',
        fields: ['scholarship.name'],
      };
      const qs = queryString.stringify(paramsObj, {
        skipEmptyString: true,
      });
      return axios
        .get<
          IPagedResponse<
            Resume & {
              scholarship: Pick<SchoolarShip, '_id' | 'name'>;
            }
          >
        >(`/resumes?${qs}`)
        .then((d) => d.data);
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
