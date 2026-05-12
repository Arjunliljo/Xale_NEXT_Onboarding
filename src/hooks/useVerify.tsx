"use client";

import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/src/lib/axios/axiosConfig";
import { authVerify } from "@/src/lib/endpoints";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout, setCurrentUser, setToken } from "@/src/lib/features/authSlice";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function useVerify() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const hasVerified = useRef(false);

  const { mutate, isPending, data, error } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(authVerify);
      return response.data;
    },
    onSuccess: (res) => {
      const { user } = res ?? {};
      dispatch(setCurrentUser(user));
    },
    onError: (e) => {
      console.error(e);
      toast.error("Please login again");
      dispatch(logout());
      router.replace("/login");
    },
  });

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    // Google OAuth redirect carries the access token in the query string.
    const tokenFromParams = searchParams?.get("token");
    if (tokenFromParams) {
      dispatch(setToken(tokenFromParams));

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("token");
        window.history.replaceState({}, "", url.toString());
      }
    }

    mutate();
  }, [dispatch, mutate, searchParams]);

  return {
    verify: mutate,
    isLoading: isPending,
    user: data?.user,
    error,
  };
}
