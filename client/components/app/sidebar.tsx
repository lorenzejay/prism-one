import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CurrentDash } from "../../types/UITypes";
import { useRouter } from "next/router";

interface SidebarProps {
  currentDash: CurrentDash;
  setCurrentDash: (x: CurrentDash) => void;
}
const Sidebar = ({ currentDash, setCurrentDash }: SidebarProps) => {
  const [minimizeSidebar, setMinimizeSidebar] = useState(true);
  const [revealMinimizeSbButton, setRevealMinimizeSbButton] = useState(false);
  const router = useRouter();
  const path = router.pathname;
  // console.log("path", path.slice(1, path.length));
  useEffect(() => {
    const lastSidebarState = window.localStorage.getItem("minimizeSidebar");
    if (lastSidebarState) {
      setMinimizeSidebar(JSON.parse(lastSidebarState));
    } else {
      localStorage.setItem("minimizeSidebar", JSON.stringify(minimizeSidebar));
    }
  }, []);
  console.log("currentDash", currentDash);
  return (
    <div
      className={`flex transition-width duration-500 ease-in-out flex-col  relative ${
        minimizeSidebar ? "lg:w-1/12" : "lg:w-1/6"
      }`}
      onMouseOver={() => setRevealMinimizeSbButton(true)}
      onMouseLeave={() => setRevealMinimizeSbButton(false)}
    >
      <div
        className={`text-black absolute top-0 right-2  ${
          revealMinimizeSbButton ? "block" : "hidden"
        }`}
        onClick={() => {
          localStorage.setItem(
            "minimizeSidebar",
            JSON.stringify(!minimizeSidebar)
          );
          setMinimizeSidebar(!minimizeSidebar);
        }}
      >
        x
      </div>
      <ul className="">
        <Link href="/home">
          <li
            className="mb-5"
            onClick={() => {
              window.localStorage.setItem("currentDash", CurrentDash.Home);
              setCurrentDash(CurrentDash.Home);
            }}
          >
            <button
              className={`cursor-pointer  text-left w-full p-2 focus:border-l-2 ${
                currentDash === CurrentDash.Home
                  ? "bg-gray-100 border-l-2 border-yellow-600"
                  : "border-none bg-none"
              }`}
            >
              {minimizeSidebar ? (
                <img src="/dashboard.png" className="object-cover w-1/4" />
              ) : (
                "Dashboard"
              )}
            </button>
          </li>
        </Link>
        <Link href="/clients">
          <li className="mb-5">
            <button
              onClick={() => {
                localStorage.setItem("currentDash", CurrentDash.Clients);
                setCurrentDash(CurrentDash.Clients);
              }}
              className="cursor-pointer  text-left focus:bg-gray-100 w-full p-2 focus:border-l-2 focus:border-yellow-600"
            >
              {minimizeSidebar ? (
                <img src="/customer.png" className="object-cover w-1/4" />
              ) : (
                "Clients"
              )}
            </button>
          </li>
        </Link>
        <Link href="/projects">
          <li
            className="mb-5"
            onClick={() => {
              window.localStorage.setItem("currentDash", CurrentDash.Jobs);
              setCurrentDash(CurrentDash.Jobs);
            }}
          >
            <button
              className={`cursor-pointer  text-left w-full p-2 focus:border-l-2 ${
                currentDash === CurrentDash.Jobs
                  ? "bg-gray-100 border-l-2 border-yellow-600"
                  : "border-none bg-none"
              }`}
            >
              {minimizeSidebar ? (
                <img src="/briefing.png" className="object-cover w-1/4" />
              ) : (
                "Projects"
              )}
            </button>
          </li>
        </Link>
        <Link href="/tasks">
          <li className="mb-5">
            <button
              onClick={() => {
                window.localStorage.setItem("currentDash", CurrentDash.Tasks);
                setCurrentDash(CurrentDash.Tasks);
              }}
              className={`cursor-pointer  text-left w-full p-2 focus:border-l-2 ${
                currentDash === CurrentDash.Tasks
                  ? "bg-gray-100 border-l-2 border-yellow-600"
                  : "border-none bg-none"
              }`}
            >
              {minimizeSidebar ? (
                <img src="/checklist.png" className="object-cover w-1/4" />
              ) : (
                "Tasks"
              )}
            </button>
          </li>
        </Link>
        <Link href="/email">
          <li className="mb-5">
            <button
              onClick={() => {
                window.localStorage.setItem("currentDash", CurrentDash.Email);
                setCurrentDash(CurrentDash.Email);
              }}
              className={`cursor-pointer  text-left w-full p-2 focus:border-l-2 ${
                currentDash === CurrentDash.Email
                  ? "bg-gray-100 border-l-2 border-yellow-600"
                  : "border-none bg-none"
              }`}
            >
              {minimizeSidebar ? (
                <img src="/email.png" className="object-cover w-1/4" />
              ) : (
                "Email"
              )}
            </button>
          </li>
        </Link>

        <Link href="contracts">
          <li
            className={`mb-5 ${
              currentDash === CurrentDash.Contracts
                ? "bg-gray-100 border-l-2 border-yellow-600"
                : "border-none bg-none"
            }`}
          >
            <button
              onClick={() => {
                window.localStorage.setItem(
                  "currentDash",
                  CurrentDash.Contracts
                );
                setCurrentDash(CurrentDash.Contracts);
              }}
              className={`cursor-pointer  text-left w-full p-2 focus:border-l-2 `}
            >
              {minimizeSidebar ? (
                <img src="/handshake.png" className="object-cover w-1/4" />
              ) : (
                "Contracts"
              )}
            </button>
          </li>
        </Link>
        <Link href="Galleries">
          <li className="mb-5">
            <button
              onClick={() => {
                window.localStorage.setItem(
                  "currentDash",
                  CurrentDash.Galleries
                );
                setCurrentDash(CurrentDash.Galleries);
              }}
              className={`cursor-pointer  text-left w-full p-2 focus:border-l-2 ${
                currentDash === CurrentDash.Galleries
                  ? "bg-gray-100 border-l-2 border-yellow-600"
                  : "border-none bg-none"
              }`}
            >
              {minimizeSidebar ? (
                <img src="/image.png" className="object-cover w-1/4" />
              ) : (
                "Galleries"
              )}
            </button>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
