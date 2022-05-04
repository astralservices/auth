import { Discord } from '@icons-pack/react-simple-icons';
import { User } from '@supabase/supabase-js';

export default function DiscordProvider({ user }: { user: User }) {
  return (
    <button className="flex items-center px-10 py-2 text-lg font-black text-white bg-indigo-500 rounded-md gap-x-4">
      <Discord className="w-5 h-5 text-white" color="white" />
      Signed in as {user.user_metadata.full_name}
    </button>
  );
}
