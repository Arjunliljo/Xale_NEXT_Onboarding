"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import {
  type UseFormRegister,
  type FieldErrors,
  type UseFormHandleSubmit,
  type UseFormWatch,
  useForm,
} from "react-hook-form";
import { useIndustries } from "@/src/hooks/useIndustries";
import type { SelectOption } from "@/src/components/Layout/OnBoardingDropDown";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useVerify from "@/src/hooks/useVerify";

export const onboardingSchema = z.object({
  companyName: z.string().min(3, "Company name is required"),
  category: z.union([z.string(), z.number()]).refine(
    (v) => (typeof v === "string" ? v.length > 0 : !!v),
    { message: "Select an option" },
  ),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface IndustryConfigs {
  options: SelectOption[];
}

interface OnboardingContextType {
  onBoardingRegister: UseFormRegister<OnboardingFormData>;
  onBoardingErrors: FieldErrors<OnboardingFormData>;
  onBoardingHandleSubmit: UseFormHandleSubmit<OnboardingFormData>;
  industryConfigs: IndustryConfigs;
  watch: UseFormWatch<OnboardingFormData>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

interface OnboardingProviderProps {
  children: ReactNode;
}

function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { user } = useVerify();
  const industryConfigs = useIndustries();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
  });

  useEffect(() => {
    if (user?.tenantId) {
      reset({
        companyName: user?.tenant?.tenantName ?? "",
        category: user?.tenant?.industryId ?? "",
      });
    }
  }, [reset, user]);

  const value: OnboardingContextType = {
    onBoardingRegister: register,
    onBoardingErrors: errors,
    onBoardingHandleSubmit: handleSubmit,
    industryConfigs,
    watch,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

function useOnboarding(): OnboardingContextType {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }

  return context;
}

export { useOnboarding, OnboardingProvider };
