'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import LayoutWrapper from "@/src/components/Layout/LayoutWrapper";
import HeadingGradientTextsGreen from "@/src/components/Texts/HeadingGradientTexts";
import LargeInput from "@/src/components/Inputs/LargeInputs";
import { PrimaryButton } from "@/src/components/Buttons/PrimaryButton";
import HyperLinkTexts from "@/src/components/Texts/HyperLinkTexts";
import { AppleIcon, FaceBookIcon, GoogleIcon } from "@/src/lib/utilities/icons";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/src/lib/axios/axiosConfig";
import { authRegister } from "@/src/lib/endpoints";
import { toast } from "react-toastify";



// --- Validation Schema ---
const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });


  const { mutate, isPending } = useMutation({
    mutationFn: (data: SignupFormData) => {
      return axiosInstance.post(authRegister, data);
    },
    onSuccess: (res) => {
      toast.success("OTP sent successfully");
      const user = res?.data?.result?.user;
      if (user && typeof window !== "undefined") {
        localStorage.setItem("pendingUser", JSON.stringify(user));
      }
      router.push("/otp-verification");
    },
    onError: (error: any) => {
      // Handle case where error may not have .response
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = (data: SignupFormData) => {
    mutate(data);
  };

  return (
    <LayoutWrapper>
      {/* Main Content Content Wrapper */}
      <div className="w-full flex flex-col items-center justify-center grow z-10">
        {/* Header Section */}
        <HeadingGradientTextsGreen
          top="Hey there"
          bottom="Let's get you into your CRM"
        />

        {/* Form Section */}
        <div className="w-full space-y-6 max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <LargeInput
              type="email"
              placeholder="Enter email"
              error={errors.email}
              // passing validation via register
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
              })}
            />

            {/* Submit Button - Black Pill Shape */}
            <PrimaryButton type="submit" disabled={isPending} style={{ width: "100%" }}>
              {isPending ? "Processing..." : "Continue"}
            </PrimaryButton>
            <div className="flex justify-center">
              <HyperLinkTexts href="login">Login with password</HyperLinkTexts>
            </div>
          </form>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="grow border-t border-gray-200"></div>
            <span className="shrink-0 mx-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
              OR
            </span>
            <div className="grow border-t border-gray-200"></div>
          </div>

          <div className="text-center text-sm text-gray-500 mb-4">
            Continue with
          </div>

          {/* Social Login Buttons (Placeholders matching image style) */}
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
