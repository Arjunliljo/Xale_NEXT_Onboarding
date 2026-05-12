"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import LayoutWrapper from "@/src/components/Layout/LayoutWrapper";
import HeadingGradientTextsGreen from "@/src/components/Texts/HeadingGradientTexts";
import { PrimaryButton } from "@/src/components/Buttons/PrimaryButton";
import Timer from "./components/Timer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/src/lib/axios/axiosConfig";
import { authResendOtp, authValidateOtp } from "@/src/lib/endpoints";
import { useDispatch } from "react-redux";
import { setTokenAndUser } from "@/src/lib/features/authSlice";

// --- Validation Schema ---
const otpSchema = z.object({
  otp: z.string().length(6, "Please enter a complete 6-digit code"),
});

type OtpFormData = z.infer<typeof otpSchema>;



export default function OTPPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUser] = useState<{ email: string; profileCompletion?: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // <-- FIX: avoid redirect before hydration
  const [otpArray, setOtpArray] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(30);

  // Read user from localStorage safely
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("pendingUser");

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          setUser(parsed);
          setLoading(false);
          return;
        }
      }

      setLoading(false);
    } catch (e) {
      console.error("Failed to read pendingUser", e);
      setLoading(false);
    }
  }, []);

  // Redirect only AFTER loading check
  useEffect(() => {
    if (!loading && !user?.email) {
      toast.error("Please sign up first!");
      router.push("/signup");
    }
  }, [loading, user, router]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);



  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { mutate: submitOtp, isPending } = useMutation({
    mutationFn: (data: OtpFormData) => {
      return axiosInstance.post(authValidateOtp, {
        email: user?.email || "",
        otp: data?.otp || "",
      });
    },
    onSuccess: (response) => {
      const token = response?.data?.accessToken;
      const userData = response?.data?.data?.user;

      dispatch(
        setTokenAndUser({
          token,
          user: userData,
        })
      );

      // profileCompletion=10 (just verified) → set password; >10 → onboarding
      if ((userData?.profileCompletion ?? 0) > 10) {
        router.push("/onboarding");
      } else {
        router.push("/create-password");
        toast.success("Email verified successfully!");
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid OTP. Please try again.";
      toast.error(message);
    },
  });

  const { mutate: resendOtp, isPending: isResending } = useMutation({
    mutationFn: () => {
      return axiosInstance.post(authResendOtp, {
        email: user?.email || "",
      });
    },
    onSuccess: () => {
      toast.success("Code resent successfully!");
      setTimer(30);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend code. Please try again.";
      toast.error(message);
    },
  });



  useEffect(() => {
    const otpString = otpArray.join("");
    setValue("otp", otpString, { shouldValidate: otpString.length === 6 });
  }, [otpArray, setValue]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otpArray];
    newOtp[index] = element.value;
    setOtpArray(newOtp);




    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");

    if (pastedData.every((char) => !isNaN(Number(char)))) {
      const newOtp = [...otpArray];
      pastedData.forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });

      setOtpArray(newOtp);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };




  const onSubmit = (data: OtpFormData) => {
    submitOtp(data);
  };

  const onInvalid = (formErrors: typeof errors) => {
    console.warn("OTP form validation failed", formErrors, { otpArray });
    toast.error(formErrors.otp?.message ?? "Please enter the 6-digit code");
  };

  // Prevent UI flash before loading
  if (loading) {
    return (
      <LayoutWrapper>
        <div className="w-full max-w-lg flex justify-center items-center h-[400px]">
          <p>Loading...</p>
        </div>
      </LayoutWrapper>
    );
  }


  return (
    <LayoutWrapper>
      <div className="w-full flex flex-col items-center justify-center grow z-10">

        {/* Header Section */}
        <HeadingGradientTextsGreen
          top={user?.profileCompletion && user.profileCompletion > 0 ? "Welcome Back" : "Almost there"}
          bottom="We just sent you a code"
          gradient="var(--gradient-text-gray)"
        />

        <div
          style={{ marginTop: "-2rem", marginBottom: "5rem" }}
          className="text-b2 text-var(--color-text-gray) flex items-center justify-center flex-col md:flex-row max-md:!mb-12 max-sm:!mb-8 max-sm:px-4 text-center"
        >
          <span>
          We sent a 6-digit code to
          </span>
          <span>
          <Link href={"/sign-up"} className="text-b2-bold underline ml-1">
              {user?.email}
            </Link>
          </span>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="w-full flex flex-col items-center space-y-8 max-w-md">

          {/* OTP Inputs */}
          <div className="flex flex-col w-full">
            <div className="flex justify-between w-full max-sm:[gap:0.35rem]" style={{ gap: "0.6rem" }}>
              {otpArray.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleChange(e.target as HTMLInputElement, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className={`h-12 max-sm:h-11 w-full text-center text-xl md:text-2xl max-sm:text-lg font-medium border rounded-xl outline-none transition-all bg-white
                    ${
                      errors.otp
                        ? "border-[var(--color-error)] ring-1 ring-[var(--color-error)]"
                        : digit
                        ? "border-[var(--color-black-10)] ring-1 ring-[var(--color-black-10)]"
                        : "border-[var(--color-border-input)] focus:border-[var(--color-black-10)] focus:ring-1 focus:ring-[var(--color-black-10)]"
                    }`}
                />
              ))}
            </div>

            {errors.otp && (
              <p className="mt-2 text-b5 text-[var(--color-error)]">{errors.otp.message}</p>
            )}
          </div>

          <PrimaryButton
            type="submit"
            disabled={isPending || otpArray.some((d) => !d)}
            style={{ width: "100%", opacity: "1" }}
          >
            {isPending ? "Verifying..." : "Verify & Continue"}
          </PrimaryButton>

          {/* Resend Timer */}
          <Timer seconds={timer}>
            <button
              type="button"
              onClick={() => resendOtp()}
              disabled={isResending}
              className="font-medium text-var(--color-black-10) underline hover:text-black transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              {isResending ? "Resending..." : "Resend code"}
            </button>
          </Timer>
        </form>
      </div>
    </LayoutWrapper>
  );
}

