"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useSelector } from "react-redux";

import HeadingGradientTextsGreen from "@/src/components/Texts/HeadingGradientTexts";
import PlanToggle from "../components/PlanToggle";
import PricingCard from "../components/PricingCard";
import { usePlans } from "@/src/hooks/usePlans";

export default function SelectPlan() {
  const { isOnBoarded } = useSelector(
    (state: { basic: { isOnBoarded: boolean | null } }) => state.basic
  );
  const [isMonthly, setIsMonthly] = useState(true);

  const handleToggle = () => {
    setIsMonthly((val) => !val);
  };

  const { plans, isLoading } = usePlans();

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-between overflow-hidden relative z-10 py-4 ${
        !isOnBoarded ? "onboarding-anim-2" : ""
      }`}
    >
      <div className="flex flex-col items-center shrink-0">
        <HeadingGradientTextsGreen top="" bottom="Choose Your Plan" />
        <p className="text-b2 text-[var(--color-text-gray)] flex items-center justify-center mt-[-2rem] mb-8">
          Pick a plan that fits your companies needs. Don't Worry - you can
          always upgrade later
        </p>
        <PlanToggle onClick={handleToggle} value={isMonthly} />
      </div>

      <div className="plan-container">
        {isLoading ? (
          <p className="text-b2 text-gray-500">Loading plans…</p>
        ) : (
          plans
            ?.filter((p) => p.isActive)
            .map((val) => (
              <PricingCard key={val.id} item={val} isMonthly={isMonthly} />
            ))
        )}
      </div>

      <div className="flex flex-col items-center gap-1 h-[4rem] w-full shrink-0 text-b2">
        <div className="flex items-center justify-center text-[#697571]">
          All plans include WhatsApp Business · Lead automations · Role-based access
        </div>
        <div className="flex items-center justify-center">
          Facing an issue while choosing a plan?
          <a
            href="mailto:support@xale.in"
            className="underline ml-2 cursor-pointer text-black"
          >
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
}
