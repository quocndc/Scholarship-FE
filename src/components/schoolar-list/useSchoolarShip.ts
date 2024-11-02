import { getScholarShipKey } from '@components/schoolar-list/constant';
import { Filter } from '@components/schoolar-list/ScholarshipTableFilter';
import axios from '@lib/axios';
import { IPagedRequest, IPagedResponse, SchoolarShip } from '@lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import queryString from 'query-string';

const initialRequest: IPagedRequest = {
  current: 1,
  pageSize: 30,
};
type UseGetSchoolarShip = {
  filter?: Filter;
  request?: IPagedRequest;
};
export function useGetSchoolarShip(props: UseGetSchoolarShip) {
  const { filter, request } = props;
  return useInfiniteQuery<IPagedResponse<SchoolarShip>>({
    queryKey: getScholarShipKey.list(filter),
    queryFn: ({ pageParam }) => {
      const paramsObj = {
        ...initialRequest,
        current: pageParam,
        name: filter?.name && new RegExp(filter.name, 'i'),
        level: filter?.level && new RegExp(filter.level, 'i'),
        location: filter?.location && new RegExp(filter.location, 'i'),
        continent: filter?.continent && new RegExp(filter.continent, 'i'),
      };
      const qs = queryString.stringify(paramsObj, {
        skipEmptyString: true,
      });
      return axios.get<IPagedResponse<SchoolarShip>>(`/scholarship?${qs}`).then((d) => d.data);
    },
    initialPageParam: request ?? initialRequest.current,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.meta.current >= lastPage.data.meta.pages) {
        return undefined;
      }
      return lastPage.data.meta.current + 1;
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.data.meta.current <= 1) return undefined;
      return firstPage.data.meta.current - 1;
    },
  });
}
