"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";

import { PrimaryButton } from "@/src/components/Buttons/PrimaryButton";
import { LightGreenBtn } from "@/src/components/Buttons/LightGreenButton";
import LinkSection from "@/src/components/footer/LinkSection";
import { LeftArrowIcon, RightArrowIcon } from "@/src/lib/utilities/icons";
import { useGetPathNum } from "@/src/hooks/useGetPathNum";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import {
  useOnboarding,
  type OnboardingFormData,
} from "@/src/context/OnboardingContext";
import useVerify from "@/src/hooks/useVerify";
import axiosInstance from "@/src/lib/axios/axiosConfig";
import { tenantCreate, tenantEditProfile } from "@/src/lib/endpoints";

const footerIllustration1 = "/assets/images/footerIllustration-1.svg";
const footerIllustration2 = "/assets/images/footerIllustration-2.svg";
const footerIllustration3 = "/assets/images/footerIllustration-3.svg";

  const IMAGES = [footerIllustration1, footerIllustration2, footerIllustration3];

export const ONBOARDING_STEPS = [
    "/onboarding",
    "/onboarding/company-details",
    "/onboarding/select-plan",
  ];

function LayoutOnboardingFooter() {

  const isOnBoarded = false;
  const router = useRouter();
  const { pathNum } = useGetPathNum(ONBOARDING_STEPS);

  const isMobileOrTablet = useMediaQuery("(max-width: 1024px)");

  const { user, verify } = useVerify();
  const { onBoardingHandleSubmit } = useOnboarding();

  const currentImage =
    pathNum >= 0 && pathNum < IMAGES.length ? IMAGES[pathNum] : IMAGES[0];

  const { mutate: saveTenantProfile, isPending: isSavingProfile } = useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      const body = {
        tenantName: data.companyName,
        industryId: Number(data.category),
      };

      const currentTenant = user?.tenant;

      if (!user?.tenantId) {
        return axiosInstance.post(tenantCreate, body);
      }

      const isChangedName = body.tenantName !== currentTenant?.tenantName;
      const isChangedIndustry = body.industryId !== currentTenant?.industryId;

      if (isChangedName || isChangedIndustry) {
        return axiosInstance.patch(tenantEditProfile, body);
      }

      return Promise.resolve({ data: "No changes detected" });
    },
    onSuccess: () => {
      // Refresh the user so the next step sees the new tenantId.
      verify();
      router.push(ONBOARDING_STEPS[1]);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    },
  });

  const handleNext = () => {
    if (pathNum === 0) {
      // Submit the onboarding form — creates the tenant if one doesn't exist.
      onBoardingHandleSubmit((data) => saveTenantProfile(data))();
      return;
    }
    if (pathNum < ONBOARDING_STEPS.length - 1) {
      router.push(ONBOARDING_STEPS[pathNum + 1]);
    } else {
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (pathNum > 0) {
      router.push(ONBOARDING_STEPS[pathNum - 1]);
    }
  };

  const isFirstStep = pathNum === 0;

  return (
    <div
      className={`w-full mt-auto relative z-0 ${
        !isOnBoarded ? "onboarding-anim-2" : ""
      }`}
    >
      <div
        className={`w-[90vw] m-auto mb-10 px-4 sm:px-6 ${
          isMobileOrTablet
            ? "flex flex-row items-center justify-between gap-4"
            : "grid grid-cols-3 items-end gap-8"
        }`}
        style={!isMobileOrTablet ? { gridTemplateColumns: "1fr auto 1fr" } : {}}
      >
        <div className={`flex ${isMobileOrTablet ? "justify-start" : "justify-start"}`}>
          <LightGreenBtn
            style={{
              width: isMobileOrTablet ? "auto" : "15rem",
              minWidth: isMobileOrTablet ? "120px" : "15rem",
              opacity: isFirstStep ? "0" : "1",
              pointerEvents: isFirstStep ? "none" : "auto",
            }}
            Icon={LeftArrowIcon}
            onClick={handleBack}
          >
            Back
          </LightGreenBtn>
        </div>

        {!isMobileOrTablet && (
          <div className="flex justify-center w-full mb-2">
            <Image
              src={currentImage}
              alt="Footer Illustration"
              width={800}
              height={800}
              className="h-auto object-contain"
              style={{ maxWidth: "100%", maxHeight: "800px" }}
            />
          </div>
        )}


        <div className={`flex ${isMobileOrTablet ? "justify-end" : "justify-end"}`}>
          <PrimaryButton
            style={{
              width: isMobileOrTablet ? "auto" : "15rem",
              minWidth: isMobileOrTablet ? "7.5rem" : "15rem",
            }}
            onClick={handleNext}
            disabled={isSavingProfile}
            Icon={RightArrowIcon}
          >
            {pathNum === ONBOARDING_STEPS.length - 1
              ? "Finish"
              : isSavingProfile
                ? "Saving…"
                : "Continue"}
          </PrimaryButton>
        </div>
      </div>

      <LinkSection />
    </div>
  );
}

export default LayoutOnboardingFooter;
