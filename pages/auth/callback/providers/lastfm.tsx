import { supabase } from '@astral/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Spinner from '../../../../components/Spinner';
import { useAuth } from '@astral/auth';

export default function LastfmCallback() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const { session } = useAuth();

  const router = useRouter();
  useEffect(() => {
    if (!router.query.token) return;
    fetch(
      `
      /api/providers/lastfm/callback?token=${router.query.token}
    `,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    ).then(async (res) => {
      setLoading(false);
      if (res.status === 200) {
        router.push('/');
      } else {
        console.error(await res.text());
      }
    });
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
                Linking account!
              </h1>
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
