import axios from '@lib/axios';
import { IPagedResponse, IResponse, Study } from '@lib/types';
import queryString from 'query-string';

export async function getStudyDetails(id?: string) {
  return axios.get<IResponse<Study>>(`/study/${id}`).then((d) => d.data.data);
}

export async function getRelatedStudies(filter: Partial<Pick<Study, 'location' | 'continent'>>) {
  const paramsObj = {
    continent: filter?.continent && new RegExp(filter.continent, 'i'),
    location: filter?.location && new RegExp(filter.location, 'i'),
    current: 1,
    pageSize: 5,
  };
  const qs = queryString.stringify(paramsObj, {
    skipEmptyString: true,
    encode: false,
  });
  return axios.get<IPagedResponse<Study[]>>(`/study?${qs.toString()}`).then((d) => d.data.data.result);
}
