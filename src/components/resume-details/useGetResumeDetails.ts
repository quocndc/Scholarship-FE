import { getResumeKey } from '@components/resume-list';
import axios from '@lib/axios';
import { IResponse, Resume } from '@lib/types';
import { useQuery } from '@tanstack/react-query';
import queryString from 'query-string';

type Options = {
  enabled?: boolean;
};
export function useGetResumeDetails(id: string, option: Options = {}) {
  return useQuery({
    queryKey: getResumeKey.id(id),
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
      return axios.get<IResponse<Resume>>(`/resumes/${id}?${qs}`).then((d) => d.data.data);
    },
    ...option,
  });
}
