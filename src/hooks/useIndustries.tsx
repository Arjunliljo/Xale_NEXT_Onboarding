import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/lib/axios/axiosConfig";
import { platformIndustry } from "@/src/lib/endpoints";
import type { SelectOption } from "@/src/components/Layout/OnBoardingDropDown";

export interface Industry {
  id: number;
  name: string;
}

interface UseIndustriesResult {
  industries: Industry[];
  options: SelectOption[];
  isLoading: boolean;
  error: unknown;
}

export function useIndustries(): UseIndustriesResult {
  const {
    data: industries = [],
    isLoading,
    error,
  } = useQuery<Industry[]>({
    queryKey: ["industries"],
    queryFn: async () => {
      const res = await axiosInstance.get(platformIndustry);
      return (res.data?.industries ?? []) as Industry[];
    },
  });

  const options: SelectOption[] = industries.map((obj) => ({
    label: obj.name,
    value: obj.id,
  }));

  return { industries, options, isLoading, error };
}
