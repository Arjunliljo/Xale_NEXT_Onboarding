"use client";

import LayoutWrapper from "@/src/components/Layout/LayoutWrapper";
import { PrimaryButton } from "@/src/components/Buttons/PrimaryButton";
import HeadingGradientTextsGreen from "@/src/components/Texts/HeadingGradientTexts";
import LargeInput from "@/src/components/Inputs/LargeInputs";
import HyperLinkTexts from "@/src/components/Texts/HyperLinkTexts";
import { AppleIcon, FaceBookIcon, GoogleIcon } from "@/src/lib/utilities/icons";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/src/lib/axios/axiosConfig";
import { authLogin } from "@/src/lib/endpoints";
import { useDispatch } from "react-redux";
import { setTokenAndUser } from "@/src/lib/features/authSlice";
import { toast } from "react-toastify";
import { usePublicTenantByHostname } from "@/src/hooks/usePublicTenantByHostname";
import { getCrmRedirectBase } from "@/src/lib/apiBase";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: tenantBranding } = usePublicTenantByHostname();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginFormData) => {
      return axiosInstance.post(authLogin, data);
    },
    onSuccess: (response) => {
      const token = response?.data?.accessToken;
      const userData = response?.data?.data?.user;

      dispatch(setTokenAndUser({ token, user: userData }));
      toast.success("Welcome back!");

      const completion = userData?.profileCompletion ?? 0;
      if (completion < 15) {
        router.push("/create-password");
      } else if (completion < 20) {
        router.push("/onboarding");
      } else {
        const crmRedirectBase = getCrmRedirectBase();
        if (crmRedirectBase && token) {
          window.location.href = `${crmRedirectBase}/auth-redirect?token=${token}`;
        } else {
          router.push("/");
        }
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid credentials. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <LayoutWrapper>
      {/* Main Content Content Wrapper */}
      <div className="w-full  flex flex-col items-center justify-center grow  z-10">
        {tenantBranding && (
          <div className="flex flex-col items-center gap-2 mb-6">
            {(tenantBranding.tenantLogoUrl || tenantBranding.logo) && (
              <img
                src={tenantBranding.tenantLogoUrl || tenantBranding.logo || ""}
                alt={tenantBranding.tenantName}
                className="h-14 w-14 rounded-full object-cover border border-gray-200"
              />
            )}
            <div className="text-lg font-medium text-gray-900">
              {tenantBranding.tenantName}
            </div>
          </div>
        )}

        {/* Header Section */}
        <HeadingGradientTextsGreen
          top={tenantBranding ? "Welcome back !" : "Hey there !"}
          bottom={
            tenantBranding
              ? `Sign in to ${tenantBranding.tenantName}`
              : "Let's get you into your CRM"
          }
          // style={{ marginBottom: "5rem" }}
        />

        {/* Form Section */}
        <div className="w-full space-y-6 max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <LargeInput
              type="email"
              placeholder="Enter email"
              error={errors.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/,
                  message: "Invalid email",
                },
              })}
            />

            {/* Password Field */}
            <LargeInput
              type="password"
              placeholder="Enter password"
              error={errors.password}
              {...register("password", {
                required: "Password is required",
              })}
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <HyperLinkTexts href="forgot-password">
                Forgot Password?
              </HyperLinkTexts>
            </div>

            {/* Submit Button - Black Pill Shape */}
            <PrimaryButton
              type="submit"
              disabled={isPending}
              style={{ width: "100%" }}
            >
              {isPending ? "Logging in..." : "Login"}
            </PrimaryButton>

            <div className="flex justify-center">
              <HyperLinkTexts href="signup">Sign up</HyperLinkTexts>
            </div>
          </form>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
              OR
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="text-center text-sm text-gray-500 mb-4 ">
            Continue with
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center gap-4">
            {/* Apple */}
            <AppleIcon />
            {/* Google */}
            <GoogleIcon />
            {/* Facebook */}
            <FaceBookIcon />
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
