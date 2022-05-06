import { supabase } from "./supabase";
import { Session, User } from "@supabase/supabase-js";
import {
  Component,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import Router, { useRouter } from "next/router";
import Cookies from "js-cookie";

interface AuthContext {
  session: Session | null;
  user: User | null;
  loading: boolean;
  login: () => Promise<any>;
  logout: (redirectTo?: string) => Promise<any>;
}

const AuthContext = createContext<Partial<AuthContext>>({
  session: null,
  user: null,
  loading: false,
  login: () =>
    supabase.auth.signIn(
      { provider: "discord" },
      {
        scopes: "identify email guilds",
        redirectTo: `${
          process.env["NEXT_PUBLIC_AUTH_ENDPOINT"] ||
          "https://dash.astralapp.io"
        }/auth/callback`,
      }
    ),
  logout: async (redirectTo?: string) => {
    Cookies.remove("sb-token", {
      domain:
        process.env["NODE_ENV"] === "production"
          ? "auth.astralapp.io"
          : "localhost",
    });
    Cookies.remove("sb:token", {
      domain:
        process.env["NODE_ENV"] === "production"
          ? "auth.astralapp.io"
          : "localhost",
    });
    Cookies.remove("sb-session", {
      domain:
        process.env["NODE_ENV"] === "production"
          ? "auth.astralapp.io"
          : "localhost",
    });
    if (redirectTo) {
      await supabase.auth.signOut();

      return Router.push(redirectTo);
    } else {
      return supabase.auth.signOut();
    }
  },
});

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(supabase.auth.user());
  const [session, setSession] = useState<Session | null>(
    supabase.auth.session()
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const session = supabase.auth.session();
    setSession(session);
    setIsAuthenticated(session !== null);
    const user = supabase.auth.user();
    setUser(user);
    setLoading(false);

    supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = supabase.auth.user();

      setUser(newUser);

      if (newUser && event === "SIGNED_IN") {
        fetch(`${process.env["NEXT_PUBLIC_API_ENDPOINT"]}`)
          .then(() => {
            Cookies.set("sb-token", session?.access_token ?? "", {
              sameSite: "Lax",
              secure: process.env["NODE_ENV"] === "production",
            });
            Cookies.set("sb-session", JSON.stringify(session), {
              sameSite: "Lax",
              secure: process.env["NODE_ENV"] === "production",
            });
          })
          .catch(() => {
            // api is offline
            toast.error(() => (
              <p>
                This is odd, our API is offline! Check our{" "}
                <a
                  href="https://astral.instatus.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-astral"
                >
                  status page
                </a>
                .
              </p>
            ));
          });
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
        router.push("/");
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session: isAuthenticated ? supabase.auth.session() : null,
        user,
        loading,
        login: () =>
          fetch(`${process.env["NEXT_PUBLIC_API_ENDPOINT"]}/api/v1/auth/login/discord`, {
            method: "GET",
          }),
        logout: async (redirectTo?: string) => {
          Cookies.remove("sb-token", {
            domain:
              process.env["NODE_ENV"] === "production"
                ? "auth.astralapp.io"
                : "localhost",
          });
          Cookies.remove("sb:token", {
            domain:
              process.env["NODE_ENV"] === "production"
                ? "auth.astralapp.io"
                : "localhost",
          });
          Cookies.remove("sb-session", {
            domain:
              process.env["NODE_ENV"] === "production"
                ? "auth.astralapp.io"
                : "localhost",
          });
          if (redirectTo) {
            await supabase.auth.signOut();

            return Router.push(redirectTo);
          } else {
            return supabase.auth.signOut();
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };
