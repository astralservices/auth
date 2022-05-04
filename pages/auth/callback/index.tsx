import { supabase } from "../../../util/supabase";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Spinner from "../../../components/Spinner";

export default function AuthCallback() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();

  const router = useRouter();
  useEffect(() => {
    if (router.query.error) {
      console.error(router.query.error);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      supabase.auth
        .getSessionFromUrl({ storeSession: true })
        .then((session) => {
          const user = supabase.auth.user();
          setUser(user);
          const redirectUrl = localStorage.getItem("redirectUrl");
          localStorage.setItem("discord_token", session.data.provider_token);
          router.push(redirectUrl || "/");
          localStorage.removeItem("redirectUrl");
        });
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full align-middle bg-black">
      <div className="grid items-center justify-center w-full max-w-lg grid-cols-4 gap-4 px-12 py-6 bg-gray-900 rounded-md max-h-min">
        <div className="flex items-center justify-center space-x-8 col-span-full">
          <Image
            src="/assets/img/IconMeshed.png"
            alt="Astral Icon"
            width={64}
            height={64}
            objectFit="scale-down"
            objectPosition="50% 50%"
            className="w-8 h-8"
          />
          <div className="-space-y-2">
            <h1 className="text-2xl text-white font-display">astral</h1>
            <h2 className="text-lg text-white font-display">auth</h2>
          </div>
        </div>

        <div className="flex justify-center w-full col-span-full">
          {loading && (
            <div className="flex flex-wrap justify-center space-y-4">
              <h1 className="w-full text-2xl text-center text-white font-display">
                Signing you in!
              </h1>
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
