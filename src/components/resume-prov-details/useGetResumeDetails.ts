import { getResumeProvKey } from '@components/resume-prov-list';
import axios from '@lib/axios';
import { IResponse, ResumeProv } from '@lib/types';
import { useQuery } from '@tanstack/react-query';
import queryString from 'query-string';

type Options = {
  enabled?: boolean;
};
export function useGetResumeProvDetails(id: string, option: Options = {}) {
  return useQuery({
    queryKey: getResumeProvKey.id(id),
    queryFn: () => {
      const qs = queryString.stringify(
        {
          populate: 'scholarship',
          fields: ['scholarship.name'],
        },
        {
          skipEmptyString: true,
        }
      );
      console.log('details');
      return axios.get<IResponse<ResumeProv>>(`/resume-prov/${id}?${qs}`).then((d) => d.data.data);
    },
    ...option,
  });
}
