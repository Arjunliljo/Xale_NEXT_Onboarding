"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import LayoutWrapper from "@/src/components/Layout/LayoutWrapper";
import HeadingGradientTextsGreen from "@/src/components/Texts/HeadingGradientTexts";
import LargeInput from "@/src/components/Inputs/LargeInputs";
import { PrimaryButton } from "@/src/components/Buttons/PrimaryButton";
import HyperLinkTexts from "@/src/components/Texts/HyperLinkTexts";
import axiosInstance from "@/src/lib/axios/axiosConfig";
import { authForgotPassword } from "@/src/lib/endpoints";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ForgotPasswordFormData) => {
      return axiosInstance.post(authForgotPassword, data);
    },
    onSuccess: () => {
      toast.success(
        "If an account exists for that email, a reset link has been sent."
      );
      reset();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not process your request. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutate(data);
  };

  return (
    <LayoutWrapper>
      <div className="w-full flex flex-col items-center justify-center grow z-10">
        <HeadingGradientTextsGreen
          top="Forgot your password?"
          bottom="We'll email you a reset link"
        />

        <div className="w-full space-y-6 max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <LargeInput
              type="email"
              placeholder="Enter your registered email"
              error={errors.email}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
              })}
            />

            <PrimaryButton
              type="submit"
              disabled={isPending}
              style={{ width: "100%" }}
            >
              {isPending ? "Sending..." : "Send reset link"}
            </PrimaryButton>

            <div className="flex justify-center">
              <HyperLinkTexts href="login">Back to login</HyperLinkTexts>
            </div>
          </form>
        </div>
      </div>
    </LayoutWrapper>
  );
}
