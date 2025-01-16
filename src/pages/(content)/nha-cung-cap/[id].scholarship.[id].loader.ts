import axios from '@lib/axios';
import { IPagedResponse, SchoolarShip } from '@lib/types';
import queryString from 'query-string';

export async function getScholarProvRelatedScholarships(filter: Partial<Pick<SchoolarShip, 'major' | 'level' | 'continent'> & { provider: string }>) {
  const paramsObj = {
    level: filter?.level && new RegExp(filter.level.map((level) => `^${level}$`).join('|'), 'i'),
    major: filter?.major && new RegExp(filter.major.map((major) => `^${major}$`).join('|'), 'i'),
    provider: filter?.provider,
  };
  const qs = queryString.stringify(paramsObj, {
    skipEmptyString: true,
    encode: false,
  });

  return axios.get<IPagedResponse<SchoolarShip>>(`/scholar-prov?${qs.toString()}`).then((d) => d.data.data.result);
}
