import { getProviderKey } from '@components/provider-list/constants';
import axios from '@lib/axios';
import { IResponse, Provider } from '@lib/types';
import { useQuery } from '@tanstack/react-query';
import queryString from 'query-string';

type Options = {
  enabled?: boolean;
};
export function useGetProviderDetails(id: string, option: Options = {}) {
  return useQuery({
    queryKey: getProviderKey.id(id),
    queryFn: () => {
      const qs = queryString.stringify(
        {
          // populate: 'scholarship',
          // fields: ['scholarship.name'],
        },
        {
          skipEmptyString: true,
        }
      );
      return axios.get<IResponse<Provider>>(`/providers/${id}?${qs}`).then((d) => d.data.data);
    },
    ...option,
  });
}
