"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/src/lib/features/authSlice";

export default function AuthRedirectPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      dispatch(setToken(token));

      const crmUrl = process.env.NEXT_PUBLIC_CRM_URL;
      if (crmUrl) {
        window.location.href = `${crmUrl}/auth-redirect?token=${token}`;
      } else {
        router.replace("/");
      }
    } else {
      router.replace("/login");
    }
  }, [dispatch, router, searchParams]);

  return null;
}
