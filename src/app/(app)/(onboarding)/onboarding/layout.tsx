"use client";
import { ReactNode, useEffect, useState } from "react";
import LayoutOnboardingFooter from "@/src/components/Layout/layoutOnBoardingFooter";
import OnboardingAnimation from "@/src/components/Layout/OnboardingAnimation";
import LayoutOnboardingHeader from "@/src/components/Layout/LayoutOnboardingHeader";
import { useGetPathNum } from "@/src/hooks/useGetPathNum";
import { useDispatch, useSelector  } from "react-redux";
import { setIsOnBoarded } from "@/src/lib/features/basicSlice";
import { OnboardingProvider } from "@/src/context/OnboardingContext";

// Define your onboarding steps in order
export const ONBOARDING_STEPS = [
  "/onboarding",
  "/onboarding/company-details",
  "/onboarding/select-plan",
];

interface LayoutOnboardWrapperProps {
  children: ReactNode;
}

export default function LayoutOnboardWrapper({
  children,
}: LayoutOnboardWrapperProps) {
  const [isAnimation, setIsAnimation] = useState(true);
  const {isOnBoarded } = useSelector( (state: { basic: { isOnBoarded: boolean | null } }) => state.basic);
  const dispatch = useDispatch();

  

  useEffect(() => {
    if (isOnBoarded) return;
    const timeoutId = setTimeout(() => {
      setIsAnimation(false);
      const onBoardedTimeoutId = setTimeout(
        () => dispatch(setIsOnBoarded(true)),
        1500
      );
      return () => clearTimeout(onBoardedTimeoutId);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  const { pathNum } = useGetPathNum(ONBOARDING_STEPS);



  useEffect(() => {
    if (pathNum !== 0 && pathNum !== -1 && !isOnBoarded) {
      dispatch(setIsOnBoarded(true));
    }
  }, [pathNum]);

  return (
    <OnboardingProvider>
      <div
        className="min-h-screen flex flex-col items-center justify-between p-4 font-var(--font-helvetica-neue) relative overflow-hidden bg-var(--body-gradient)"
        style={{
          background: "var(--body-gradient)",
        }}
      >
        {isAnimation && pathNum === 0 && !isOnBoarded ? (
          <OnboardingAnimation />
        ) : (
          <>
            <LayoutOnboardingHeader num={pathNum + 1} />
            {children}
            {pathNum !== ONBOARDING_STEPS.length - 1 && <LayoutOnboardingFooter />}
          </>
        )}
      </div>
    </OnboardingProvider>
  );
}
