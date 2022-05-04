import { useAuth } from "../util/auth";
import { Blacklist, Profile } from "../util/types";
import Loader from "../util/Loader";
import {
  ArrowRightIcon,
  DownloadIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Card from "../components/Card";

export default function RestrictedPage() {
  const { session, user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [banDetails, setBanDetails] = useState<Blacklist>(null);

  const router = useRouter();

  useEffect(() => {
    if (!session || !session.access_token) return;
    fetch(
      `${process.env["NEXT_PUBLIC_API_ENDPOINT"]}/api/v1/users/@me/status`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .then(({ result: res }) => {
        if (res.status === "blacklisted") {
          setBanDetails(res.blacklist);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
  }, [session]);

  const downloadData = () => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/users/@me/data`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })
          .then((res) => {
            if (res.ok) {
              res.blob().then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.download = `${user.id}-data.json`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                resolve();
              });
            } else {
              reject();
            }
          })
          .catch(reject);
      }),
      {
        loading: "Downloading your data...",
        success: "Data downloaded!",
        error: "There was an error downloading your data.",
      }
    );
  };

  const deleteData = () => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/users/@me/data`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })
          .then((res) => {
            if (res.ok) {
              router.push("/");
              logout();
              resolve();
            } else {
              reject();
            }
          })
          .catch(reject);
      }),
      {
        loading: "Deleting your data...",
        success: "Data deleted!",
        error: "There was an error deleting your data.",
      }
    );
  };

  return (
    <Card>
      <h1 className="text-2xl font-bold text-center text-white">Restricted</h1>
      {loading && !banDetails ? (
        <Loader />
      ) : banDetails ? (
        <div>
          <p className="font-bold text-center text-gray-100">
            You&apos;ve been banned from Astral, simple as that.
          </p>
          <p className="font-bold text-center text-gray-100">
            Your ban details:
          </p>
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-gray-100">
              <span className="font-bold">Banned by:</span>{" "}
              {(banDetails.moderator as Profile).preferred_name}
            </p>
            <p className="text-gray-100">
              <span className="font-bold">Reason:</span> {banDetails.reason}
            </p>
            <p className="text-gray-100">
              <span className="font-bold">Banned on:</span>{" "}
              {new Date(banDetails.created_at).toLocaleString()}
            </p>
            <p className="text-gray-100">
              <span className="font-bold">Expires:</span>{" "}
              {banDetails.expires
                ? new Date(banDetails.expiry).toLocaleString()
                : "Never"}
            </p>
            <p className="text-gray-100">
              <span className="font-bold">Moderator Notes:</span>{" "}
              {banDetails.notes || "None"}
            </p>
            <p className="text-center text-gray-100">
              If you have any questions, please contact us at{" "}
              <a
                href="mailto:support@astralapp.io"
                className="font-bold text-white hover:text-pink-600"
              >
                support@astralapp.io
              </a>
            </p>

            {banDetails.expires && (
              <p className="text-center text-gray-100">
                If you would like to appeal, please contact us at{" "}
                <a
                  href={`mailto:support@astralapp.io?subject=Appeal for ban on Astral&body=I would like to appeal my ban on Astral. My ban ID is ${banDetails.id} and my user ID is ${banDetails.user}.`}
                  className="font-bold text-white hover:text-pink-600"
                >
                  support@astralapp.io
                </a>
              </p>
            )}

            <div className="flex space-x-4">
              <button
                onClick={downloadData}
                className="flex justify-center order-last col-span-2 px-3 py-2 my-2 text-white bg-pink-600 rounded-md md:col-span-1 gap-x-2"
              >
                <DownloadIcon className="w-6 h-6 text-white" />
                Request Data
              </button>
              <button
                onClick={deleteData}
                className="flex justify-center order-last col-span-2 px-3 py-2 my-2 text-white bg-red-500 rounded-md md:col-span-1 gap-x-2"
              >
                <TrashIcon className="w-6 h-6 text-white" />
                Delete Data
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-gray-100">you&apos;re not banned lol</p>
          <Link href={process.env.NEXT_PUBLIC_DASHBOARD_URL} passHref>
            <a className="flex items-center px-10 py-2 text-lg font-black text-center text-white bg-gray-700 rounded-md gap-x-4">
              <ArrowRightIcon className="w-5 h-5 text-white" color="white" />
              <span className="w-full text-center">Continue to Dashboard</span>
            </a>
          </Link>
        </div>
      )}
    </Card>
  );
}
