"use client";

import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "@/src/lib/axios/axiosConfig";
import { tenantOnboarding } from "@/src/lib/endpoints";
import { useOnboarding } from "@/src/context/OnboardingContext";
import type { PlanProps } from "@/src/hooks/usePlans";
import { LightGreenBtn } from "@/src/components/Buttons/LightGreenButton";
import { PrimaryButton } from "@/src/components/Buttons/PrimaryButton";

interface PricingCardProps {
  item: PlanProps;
  isMonthly: boolean;
}

const CUSTOM_PLAN_START_PRICE = 9999;

function buildFeatures(plan: PlanProps): string[] {
  const isUnlimited = (n?: number | null) => (n ?? 0) >= 9000;
  const fmt = (n: number) =>
    n >= 1000 ? `${(n / 1000).toLocaleString("en-IN")}K` : n.toLocaleString("en-IN");

  const seats = isUnlimited(plan.usersLimit)
    ? "Unlimited team seats"
    : `${plan.usersLimit} team seats`;

  const leads = isUnlimited(plan.leadsLimit)
    ? "Unlimited leads"
    : `${fmt(plan.leadsLimit)} leads stored`;

  const branches =
    plan.branchLimit > 1
      ? isUnlimited(plan.branchLimit)
        ? "Unlimited branches"
        : `${plan.branchLimit} branches`
      : "Single branch";

  const automations = isUnlimited(plan.activeAutomations)
    ? "Unlimited automations"
    : `${plan.activeAutomations ?? 0} active automations`;

  const storage = isUnlimited(plan.fileStorage)
    ? "Unlimited file storage"
    : `${plan.fileStorage ?? 0} GB file storage`;

  const support = plan.isCustomPlan
    ? "Dedicated success manager"
    : plan.isMostPopular
      ? "Priority WhatsApp & email support"
      : "Email support (24h SLA)";

  return [seats, leads, branches, automations, storage, support];
}

const PricingCard = ({ item, isMonthly }: PricingCardProps) => {
  const { token } = useSelector(
    (state: { auth: { token: string | null } }) => state.auth
  );

  const { watch } = useOnboarding();
  const industryId = watch("category");

  const isPopular = item.isMostPopular;
  const isCustomPlan = item.isCustomPlan;

  const basePrice = Number(item.price);
  const monthlyDiscountPercent = item.monthlyOffer || 0;
  const yearlyDiscountPercent = item.yearlyOffer || 0;
  const discountPercent = isMonthly ? monthlyDiscountPercent : yearlyDiscountPercent;

  const finalMonthlyPrice =
    discountPercent > 0
      ? Math.max(basePrice - (basePrice * discountPercent) / 100, 0)
      : basePrice;

  // For yearly billing show the *effective* monthly price (annual / 12).
  const displayPrice = isMonthly
    ? finalMonthlyPrice
    : Math.round((basePrice * 12 * (1 - discountPercent / 100)) / 12);

  const annualBilledTotal = Math.round(basePrice * 12 * (1 - discountPercent / 100));
  const isFree = basePrice === 0 && !isCustomPlan;

  const { mutate, isPending } = useMutation({
    mutationFn: async (plan: PlanProps) => {
      const body = {
        planId: plan.id,
        planStatus: "TRIAL",
        billingCycle: isMonthly ? "MONTHLY" : "YEARLY",
        industryId: industryId ? Number(industryId) : undefined,
      };
      return axiosInstance.post(tenantOnboarding, body);
    },
    onSuccess: () => {
      const crmUrl = process.env.NEXT_PUBLIC_CRM_URL;
      if (crmUrl && token) {
        window.location.href = `${crmUrl}/auth-redirect?token=${token}`;
      } else {
        toast.success("Onboarding complete!");
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Server error";
      toast.error(message);
    },
  });

  const handleSelectPlan = (data: PlanProps) => {
    if (data.isCustomPlan) {
      window.location.href = "mailto:sales@xale.in?subject=Enterprise%20plan%20enquiry";
      return;
    }
    mutate(data);
  };

  const features = buildFeatures(item);

  return (
    <div className="flex items-center justify-center mt-6 plan-card">
      <div
        className={`relative w-full max-w-[450px] rounded-[32px] bg-white p-1 md:p-8 shadow-sm transition-all duration-300
          ${isPopular ? "most-popular" : "border border-[#dbece5]"}
        `}
      >
        {isPopular && <div className="most-popular-tag">Most Popular</div>}

        <div className="text-center">
          <h2 className="text-[17px] max-sm:text-[15px] font-medium text-[#0f392b] tracking-tight my-2">
            {item.name}
          </h2>

          <div className="flex items-center justify-center gap-1 md:gap-3 flex-col md:flex-row">
            {!isCustomPlan && discountPercent > 0 && !isFree && (
              <span className="text-[2.2rem] text-gray-400 line-through decoration-1 decoration-gray-400/80">
                ₹{basePrice}
              </span>
            )}
            <span className="text-[2.6rem] max-md:text-[2.2rem] max-sm:text-[1.9rem] leading-none font-medium text-[#133d30] tracking-tight">
              {isCustomPlan
                ? `From ₹${CUSTOM_PLAN_START_PRICE.toLocaleString("en-IN")}`
                : isFree
                  ? "Free"
                  : `₹${displayPrice.toLocaleString("en-IN")}`}
            </span>
            {!isCustomPlan && !isFree && (
              <span className="text-[14px] text-gray-500 self-end mb-2">/mo</span>
            )}
          </div>

          <div className="mt-2 min-h-[20px] text-[13px] text-gray-500">
            {isCustomPlan ? (
              <>Talk to us — billed annually</>
            ) : isFree ? (
              <>{item.trialDays}-day free trial · No credit card required</>
            ) : isMonthly ? (
              <>Billed monthly · 18% GST extra</>
            ) : (
              <>
                ₹{annualBilledTotal.toLocaleString("en-IN")} billed yearly · 18% GST
                extra
              </>
            )}
          </div>

          {item.description && (
            <p className="mt-3 px-5 text-[15px] text-gray-600">{item.description}</p>
          )}
        </div>

        <div className="my-7 w-full border-t border-dashed border-gray-300/80"></div>

        <div className="mb-8 flex items-center justify-center">
          {isPopular && !isCustomPlan ? (
            <PrimaryButton
              onClick={() => handleSelectPlan(item)}
              className="!w-full max-md:!w-[90%]"
              style={{ height: "50px", fontSize: "16px" }}
            >
              {isPending ? "Setting up…" : "Start free trial"}
            </PrimaryButton>
          ) : (
            <LightGreenBtn
              onClick={() => handleSelectPlan(item)}
              className="!w-full max-md:!w-[90%]"
              style={{ height: "50px", fontSize: "16px" }}
            >
              {isCustomPlan
                ? "Contact sales"
                : isPending
                  ? "Setting up…"
                  : isFree
                    ? "Start free trial"
                    : "Get started"}
            </LightGreenBtn>
          )}
        </div>

        <div className="flex flex-col items-start space-y-[16px]">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 w-full">
              <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#133d30]">
                <svg
                  className="w-[12px] h-[12px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[15px] text-[#133d30]">{feature}</span>
            </div>
          ))}
        </div>

        {!isFree && !isCustomPlan && (
          <p className="mt-6 text-center text-[12px] text-gray-400">
            Cancel or downgrade anytime · UPI, cards & netbanking
          </p>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
