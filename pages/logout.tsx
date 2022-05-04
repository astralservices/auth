import { useAuth } from "../util/auth";
import { supabase } from "../util/supabase";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Card from "../components/Card";

export default function LogoutPage() {
  const router = useRouter();

  const { logout } = useAuth();

  const redirect = router.query.redirect;

  useEffect(() => {
    logout(redirect ? redirect.toString() : "/").then(() => {
      toast.success("Logged you out!");
    });
  }, [redirect, router, logout]);

  return (
    <Card>
      <div className="flex flex-wrap justify-center space-y-4">
        <h1 className="w-full text-2xl text-center text-white font-display">
          Logging you out!
        </h1>
        <svg
          className="w-12 h-12 text-white animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </Card>
  );
}
