"use client";

export const dynamic = "force-dynamic";

import { Catagory, CompanyIcon } from "@/src/lib/utilities/icons";
import HeadingGradientTextsGreen from "@/src/components/Texts/HeadingGradientTexts";
import OnBoardingInputs from "./components/onBoardingInput";
import OnBoardingDropDown from "@/src/components/Layout/OnBoardingDropDown";
import { usePreventBack } from "@/src/hooks/usePreventBack";
import { useSelector } from "react-redux";
import { useOnboarding } from "@/src/context/OnboardingContext";

export default function OnBoarding() {
  usePreventBack();
  const { isOnBoarded } = useSelector(
    (state: { basic: { isOnBoarded: boolean | null } }) => state.basic
  );
  const { onBoardingRegister, onBoardingErrors, industryConfigs } =
    useOnboarding();

  return (
    <div
      className={`w-full flex flex-col items-center justify-center grow mt-10 z-10 ${
        !isOnBoarded ? "onboarding-anim-2" : ""
      }`}
    >
      <HeadingGradientTextsGreen top="" bottom="Tell us about your company" />

      <p
        style={{ marginTop: "-2rem", marginBottom: "5rem" }}
        className="text-b2 text-var(--color-text-gray) flex items-center justify-center "
      >
        This helps us to setup your CRM right away
      </p>

      <div className="w-full px-0 md:px-[5rem] flex justify-center flex-col items-center">
        <OnBoardingInputs
          Icon={CompanyIcon}
          type="input"
          placeholder="Enter your company name"
          error={onBoardingErrors.companyName}
          {...onBoardingRegister("companyName", {
            required: "Company name is required",
          })}
        />
        <OnBoardingDropDown
          Icon={Catagory}
          options={industryConfigs.options}
          error={onBoardingErrors.category as any}
          {...onBoardingRegister("category", {
            required: "Category is required",
          })}
        />
      </div>
      <div className="h-20 opacity-0">space</div>
    </div>
  );
}
