import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/lib/axios/axiosConfig";
import { publicTenantByHostname } from "@/src/lib/endpoints";
import { isOnTenantDomain } from "@/src/lib/apiBase";

export interface PublicTenantBranding {
  id: number;
  tenantName: string;
  tenantLogoUrl: string | null;
  logo: string | null;
}

export function usePublicTenantByHostname() {
  return useQuery({
    queryKey: ["public-tenant-by-hostname"],
    queryFn: async () => {
      const res = await axiosInstance.get(publicTenantByHostname);
      return (res.data?.data ?? null) as PublicTenantBranding | null;
    },
    enabled: isOnTenantDomain(),
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
}
