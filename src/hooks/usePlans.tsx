import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/lib/axios/axiosConfig";
import { platformPlan } from "@/src/lib/endpoints";

export interface PlanProps {
  id: number;
  name: string;
  slug?: string;
  description?: string | null;
  price: number;
  currency: string;
  branchLimit: number;
  usersLimit: number;
  leadsLimit: number;
  rolesLimit: number;
  activeAutomations?: number;
  fileStorage?: number;
  scheduledReport?: number;
  monthlyOffer: number;
  yearlyOffer: number;
  trialDays: number;
  isActive: boolean;
  isMostPopular: boolean;
  isCustomPlan: boolean;
  industryId: number;
  createdAt: string;
  updatedAt: string;
}

interface UsePlansResult {
  plans: PlanProps[];
  isLoading: boolean;
  error: unknown;
}

export function usePlans(): UsePlansResult {
  const {
    data: plans = [],
    isLoading,
    error,
  } = useQuery<PlanProps[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await axiosInstance.get(platformPlan);
      return (res.data?.plans ?? []) as PlanProps[];
    },
  });

  return { plans, isLoading, error };
}
