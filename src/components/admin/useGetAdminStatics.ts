import axios from '@lib/axios';
import { DashboardColumnData, DashboardData, IResponse } from '@lib/types';
import { useQuery } from '@tanstack/react-query';

export function useGetAdminStatics() {
  return useQuery({
    queryKey: ['adminStatics'],
    queryFn: async () => {
      return axios.get<IResponse<DashboardData>>('/dashboard').then((res) => res.data.data);
    },
  });
}

export function useGetDashboardTransaction() {
  return useQuery({
    queryKey: ['dashboard-transaction'],
    queryFn: async () => {
      return axios.get<IResponse<DashboardColumnData[]>>('/dashboard/transactions').then((res) => res.data.data);
    },
  });
}

export function useGetDashboardResume() {
  return useQuery({
    queryKey: ['dashboard-resume'],
    queryFn: async () => {
      return axios.get<IResponse<DashboardColumnData[]>>('/dashboard/resumes').then((res) => res.data.data);
    },
  });
}
