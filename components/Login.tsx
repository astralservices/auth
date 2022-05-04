import { useAuth } from "../util/auth";
import Image from "next/image";

export function Login() {
  const { user, login, logout, loading, session } = useAuth();

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
        {user ? (
          <div className="w-full col-span-full">
            <h1 className="text-2xl text-center text-white font-display">
              Welcome back,
            </h1>
          </div>
        ) : (
          <div className="w-full space-y-4 col-span-full">
            <h1 className="text-2xl text-center text-white font-display">
              Please sign in
            </h1>

            <div className="flex space-y-4">
              <button
                className="w-full py-2 text-lg text-white bg-indigo-500 rounded-md font-display"
                onClick={() => login()}
              >
                Sign in with Discord
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
