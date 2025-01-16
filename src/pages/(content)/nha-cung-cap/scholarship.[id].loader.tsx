import axios from '@lib/axios';
import { IResponse, SchoolarShip } from '@lib/types';

export function getScholarshipProvById(id: string) {
  return axios.get<IResponse<SchoolarShip>>(`/scholar-prov/${id}`).then((d) => d.data.data);
}
