import axios from '@lib/axios';
import { IResponse, Provider } from '@lib/types';

export function getProviderById(id: string) {
  return axios.get<IResponse<Provider>>(`/providers/${id}`).then((res) => res.data.data);
}
