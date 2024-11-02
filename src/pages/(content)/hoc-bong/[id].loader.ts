import axios from '@lib/axios';
import { IPagedResponse, IResponse, SchoolarShip } from '@lib/types';
import queryString from 'query-string';

export async function getScholarshipDetails(id?: string) {
  return axios.get<IResponse<SchoolarShip>>(`/scholarship/${id}`).then((d) => d.data.data);
}

export async function getRelatedScholarships(filter: Partial<Pick<SchoolarShip, 'major' | 'level' | 'continent'>>) {
  const paramsObj = {
    level:
      filter?.level &&
      new RegExp(
        //use or
        filter.level.map((level) => `^${level}$`).join('|'),
        'i'
      ),
    continent: filter?.continent && new RegExp(filter.continent, 'i'),
    major: filter?.major && new RegExp(filter.major.map((major) => `^${major}$`).join('|'), 'i'),
    current: 1,
    pageSize: 5,
  };
  const qs = queryString.stringify(paramsObj, {
    skipEmptyString: true,
    encode: false,
  });
  return axios.get<IPagedResponse<SchoolarShip[]>>(`/scholarship?${qs.toString()}`).then((d) => d.data.data.result);
}
