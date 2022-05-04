import { useAuth } from "../../util/auth";
import {
  CheckIcon,
  QrcodeIcon,
  RefreshIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Roblox } from "@icons-pack/react-simple-icons";
import { User } from "@supabase/supabase-js";
import { Fragment, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import useSWR from "swr";
import { Provider, RobloxProvider } from "../../util/types";
import Spinner from "../Spinner";

function VerifyModal({ open, setOpen }) {
  const { user, session } = useAuth();
  const cancelButtonRef = useRef(null);

  const [generated, setGenerated] = useState(false);
  const [code, setCode] = useState("");

  const [robloxId, setRobloxId] = useState("");
  const [robloxUsername, setRobloxUsername] = useState("");

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-800 bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left text-white align-bottom transition-all transform bg-gray-900 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
                  <CheckIcon
                    className="w-6 h-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Link your Account
                  </Dialog.Title>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-left text-gray-50"
                      >
                        Roblox Username
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          onChange={(event) =>
                            setRobloxUsername(event.target.value)
                          }
                          className="block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Builderman"
                        />
                      </div>
                    </div>
                    {code && (
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-left text-gray-50"
                        >
                          Verification Code
                        </label>
                        <div className="flex mt-1 rounded-md shadow-sm">
                          <div className="relative flex items-stretch flex-grow focus-within:z-10">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <QrcodeIcon
                                className="w-5 h-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </div>
                            <input
                              type="text"
                              disabled
                              className="block w-full pl-10 bg-gray-800 border-gray-700 rounded-none focus:ring-indigo-500 focus:border-indigo-500 rounded-l-md sm:text-sm"
                              value={code}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              const req = await toast.promise(
                                fetch(
                                  `/api/providers/roblox/username/${robloxUsername}`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${session.access_token}`,
                                    },
                                  }
                                ),
                                {
                                  success: "Regenerated code!",
                                  error: "Error regenerating code!",
                                  loading: "Regenerating code...",
                                }
                              );

                              const { id } = await req.json();

                              setRobloxId(id);

                              setGenerated(true);
                              const codeReq = await fetch(
                                `/api/providers/roblox/code/${id}`,
                                {
                                  headers: {
                                    Authorization: `Bearer ${session.access_token}`,
                                  },
                                }
                              );
                              const { code } = await codeReq.json();
                              setCode(code);
                            }}
                            className="relative inline-flex items-center px-4 py-2 -ml-px space-x-2 text-sm font-medium text-gray-700 bg-gray-800 border border-gray-600 rounded-r-md hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <RefreshIcon
                              className="w-5 h-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-left text-gray-300">
                          Paste this anywhere in your Roblox About Me section.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                {!generated ? (
                  <button
                    type="button"
                    onClick={async () => {
                      const req = await toast.promise(
                        fetch(
                          `/api/providers/roblox/username/${robloxUsername}`,
                          {
                            headers: {
                              Authorization: `Bearer ${session.access_token}`,
                            },
                          }
                        ),
                        {
                          success: "Correct username!",
                          error: "Incorrect username!",
                          loading: "Verifying username...",
                        }
                      );

                      const { id } = await req.json();

                      setGenerated(true);
                      const codeReq = await fetch(
                        `/api/providers/roblox/code/${id}`,
                        {
                          headers: {
                            Authorization: `Bearer ${session.access_token}`,
                          },
                        }
                      );
                      const { code } = await codeReq.json();
                      setCode(code);
                    }}
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    Generate Code
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      toast
                        .promise(
                          new Promise((res, rej) => {
                            fetch(`/api/providers/roblox/verify/${robloxId}`, {
                              headers: {
                                Authorization: `Bearer ${session.access_token}`,
                              },
                            }).then((r) => {
                              if (r.ok) {
                                r.json().then((data) => {
                                  if (data.status !== "verified") {
                                    rej(data.status);
                                  } else {
                                    res(data);
                                  }
                                });
                              } else {
                                rej(r.statusText);
                              }
                            });
                          }),
                          {
                            success: "Verified!",
                            error: (e) => `Error verifying! Reason: ${e}`,
                            loading: "Verifying...",
                          }
                        )
                        .then(() => {
                          setOpen(false);
                        })
                        .catch(() => {
                          // do nothing
                        });
                    }}
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    Verify
                  </button>
                )}
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-50 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => {
                    setOpen(false);
                  }}
                  ref={cancelButtonRef}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function UnlinkModal({ open, setOpen }) {
  const { user, session } = useAuth();
  const cancelButtonRef = useRef(null);

  const [generated, setGenerated] = useState(false);
  const [code, setCode] = useState("");

  const [robloxId, setRobloxId] = useState("");
  const [robloxUsername, setRobloxUsername] = useState("");

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-800 bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left text-white align-bottom transition-all transform bg-gray-900 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                  <XIcon className="w-6 h-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Unlink your account?
                  </Dialog.Title>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={async () => {
                    toast
                      .promise(
                        fetch(`/api/providers/roblox/unlink`, {
                          headers: {
                            Authorization: `Bearer ${session.access_token}`,
                          },
                        }),
                        {
                          success: "Verified!",
                          error: (e) => `Error verifying! Reason: ${e}`,
                          loading: "Verifying...",
                        }
                      )
                      .then(() => {
                        setOpen(false);
                      })
                      .catch(() => {
                        // do nothing
                      });
                  }}
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                >
                  Unlink
                </button>

                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-50 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => {
                    setOpen(false);
                  }}
                  ref={cancelButtonRef}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default function RobloxProviderComponent({ user }: { user: User }) {
  const {
    data: provider,
    error,
    mutate,
  } = useSWR<RobloxProvider[]>("/api/providers/roblox");

  const [open, setOpen] = useState(false);
  const [promptUnlink, setPromptUnlink] = useState(false);

  const handleLogin = () => {
    setOpen(true);
  };

  useEffect(() => {
    mutate();
  }, [mutate, open, promptUnlink]);

  return (
    <>
      {provider ? (
        provider.length > 0 ? (
          <>
            {provider.map((provider) => (
              <>
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => {
                    setPromptUnlink(true);
                  }}
                  className="flex items-center justify-center px-10 py-2 text-lg font-black text-white bg-gray-800 rounded-md gap-x-4"
                >
                  <Roblox className="w-5 h-5 text-white" color="white" />
                  <span>Signed in as {provider.provider_data.username}</span>
                </button>
                <UnlinkModal open={promptUnlink} setOpen={setPromptUnlink} />
              </>
            ))}
          </>
        ) : (
          <>
            <button
              className="flex items-center justify-center px-10 py-2 text-lg font-black text-center text-white bg-gray-800 rounded-md gap-x-4"
              onClick={handleLogin}
            >
              <Roblox className="w-5 h-5 text-white" color="white" />
              <span>Sign in with Roblox</span>
            </button>
            <VerifyModal open={open} setOpen={setOpen} />
          </>
        )
      ) : (
        <div className="flex items-center justify-center px-10 py-2 text-lg font-black text-center text-white bg-gray-800 rounded-md gap-x-4">
          <Roblox className="w-5 h-5 text-white" color="white" />
          <span className="h-5">
            <Spinner className="w-5 h-5 text-white animate-spin" />
          </span>
        </div>
      )}
    </>
  );
}
