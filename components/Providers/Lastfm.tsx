import { useAuth } from "../../util/auth";
import { CheckIcon } from "@heroicons/react/outline";
import { Lastdotfm, Roblox, Spotify } from "@icons-pack/react-simple-icons";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Provider } from "../../util/types";
import Link from "next/link";

export default function LastfmProvider({
  user,
  provider,
}: {
  user: User;
  provider?: Provider;
}) {
  return (
    <>
      {provider ? (
        <Link href={`/providers/${provider.type}`} passHref>
          <a className="flex items-center justify-center px-10 py-2 text-lg font-black text-center text-white bg-[#D51007] rounded-md gap-x-4">
            <Lastdotfm className="w-5 h-5 text-white" color="white" />
            <span>Signed in as {provider.provider_id}</span>
          </a>
        </Link>
      ) : (
        <form
          action={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/login/lastfm`}
        >
          <button
            type="submit"
            className="flex items-center w-full justify-center px-10 py-2 text-lg font-black text-center text-white bg-[#D51007] rounded-md gap-x-4"
          >
            <Lastdotfm className="w-5 h-5 text-white" color="white" />
            <span>Sign in with Last.fm</span>
          </button>
        </form>
      )}
    </>
  );
}
