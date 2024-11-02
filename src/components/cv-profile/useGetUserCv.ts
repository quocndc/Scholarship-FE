import { getResumeKey } from '@components/resume-list';
import axios from '@lib/axios';
import { IResponse, Resume } from '@lib/types';
import { useQuery } from '@tanstack/react-query';

export function useGetUserCv() {
  return useQuery({
    queryKey: [getResumeKey.list()],
    queryFn: () => axios.post<IResponse<Resume[]>>('/resumes/by-user').then((res) => res.data),
  });
}
