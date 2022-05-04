import { useAuth } from "../../util/auth";
import { CheckIcon } from "@heroicons/react/outline";
import { Lastdotfm, Roblox, Spotify } from "@icons-pack/react-simple-icons";
import { User } from "@supabase/supabase-js";
import { Fragment, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import useSWR from "swr";
import { Provider } from "../../util/types";
import Spinner from "../Spinner";

export default function LastfmProvider({ user }: { user: User }) {
  const {
    data: provider,
    error,
    mutate,
  } = useSWR<Provider[]>("/api/providers/lastfm");

  const { session } = useAuth();

  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!session || !session.access_token) return;
    fetch("/api/providers/lastfm/url", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUrl(res.url);
      });
  }, [session]);

  return (
    <>
      {provider && provider.length > 0 ? (
        <>
          {provider.map((provider) => (
            <button
              key={provider.id}
              className="flex items-center justify-center px-10 py-2 text-lg font-black text-center text-white bg-[#D51007] rounded-md gap-x-4"
            >
              <Lastdotfm className="w-5 h-5 text-white" color="white" />
              <span>Signed in as {provider.provider_id}</span>
            </button>
          ))}
        </>
      ) : (
        <>
          {url ? (
            url.length > 0 ? (
              <a
                href={url}
                className="flex items-center justify-center px-10 py-2 text-lg font-black text-center text-white bg-[#D51007] rounded-md gap-x-4"
              >
                <Lastdotfm className="w-5 h-5 text-white" color="white" />
                <span>Sign in to Last.fm</span>
              </a>
            ) : (
              <div className="flex items-center justify-center px-10 py-2 text-lg font-black text-center text-white bg-[#D51007] rounded-md gap-x-4">
                <Lastdotfm className="w-5 h-5 text-white" color="white" />
                <span className="h-5">Error fetching auth URL.</span>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center px-10 py-2 text-lg font-black text-center text-white bg-[#D51007] rounded-md gap-x-4">
              <Lastdotfm className="w-5 h-5 text-white" color="white" />
              <span className="h-5">
                <Spinner className="w-5 h-5 text-white animate-spin" />
              </span>
            </div>
          )}
        </>
      )}
    </>
  );
}
