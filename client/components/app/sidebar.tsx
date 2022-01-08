import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { CurrentDash } from "../../types/UITypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
interface SidebarProps {
  currentDash: CurrentDash;
  setCurrentDash: (x: CurrentDash) => void;
  minimizeSidebar: boolean;
  setMinimizeSidebar: (x: boolean) => void;
}
const Sidebar = ({
  currentDash,
  setCurrentDash,
  minimizeSidebar,
  setMinimizeSidebar,
}: SidebarProps) => {
  const [revealMinimizeSbButton, setRevealMinimizeSbButton] = useState(false);

  const [emailDropdown, setEmailDropdown] = useState(false);
  const [contractDropdown, setContractDropdown] = useState(false);
  // console.log("path", path.slice(1, path.length));
  useEffect(() => {
    const lastSidebarState = window.localStorage.getItem("minimizeSidebar");
    const currentDashFromLocalStorage =
      window.localStorage.getItem("currentDash");
    if (lastSidebarState) {
      setMinimizeSidebar(JSON.parse(lastSidebarState));
    } else {
      localStorage.setItem("minimizeSidebar", JSON.stringify(minimizeSidebar));
    }
    // if (currentDashFromLocalStorage !== "") {
    setCurrentDash(currentDashFromLocalStorage as CurrentDash);
    // }
  }, []);
  return (
    <div
      className={`flex transition-width duration-500 ease-in-out flex-col  relative ${
        minimizeSidebar ? "w-full  md:w-1/12" : " lg:w-1/6"
      }`}
      onMouseOver={() => setRevealMinimizeSbButton(true)}
      onMouseLeave={() => setRevealMinimizeSbButton(false)}
    >
      <Head>
        <style>{dom.css()}</style>
      </Head>
      <div
        className={`hidden  text-black md:absolute md:top-0 md:right-2  ${
          revealMinimizeSbButton ? "md:block" : "hidden"
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
      <ul className="flex justify-start lg:flex-col overflow-auto max-w-full">
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
                <img src="/dashboard.png" className="object-cover " />
              ) : (
                "Dashboard"
              )}
            </button>
          </li>
        </Link>

        <Link href="/leads">
          <li className="mb-5">
            <button
              onClick={() => {
                window.localStorage.setItem("currentDash", CurrentDash.LEADS);
                setCurrentDash(CurrentDash.LEADS);
              }}
              className={`cursor-pointer  text-left w-full p-2 focus:border-l-2 ${
                currentDash === CurrentDash.LEADS
                  ? "bg-gray-100 border-l-2 border-yellow-600"
                  : "border-none bg-none"
              }`}
            >
              {minimizeSidebar ? (
                <img src="/attraction.png" className="object-cover w-1/4" />
              ) : (
                "Leads"
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
              className={`cursor-pointer  text-left w-full p-2 focus:border-l-2 ${
                currentDash === CurrentDash.Clients
                  ? "bg-gray-100 border-l-2 border-yellow-600"
                  : "border-none bg-none"
              }`}
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
        {/* <Link href="/email"> */}
        <li
          className="mb-5 relative"
          onClick={() => setEmailDropdown(!emailDropdown)}
        >
          <button
            // onClick={() => {
            //   window.localStorage.setItem("currentDash", CurrentDash.Email);
            //   setCurrentDash(CurrentDash.Email);
            // }}
            className={`cursor-pointer text-left w-24 p-2 focus:border-l-2 ${
              currentDash === CurrentDash.Email
                ? "bg-gray-100 border-l-2 border-yellow-600"
                : "border-none bg-none"
            }`}
          >
            {minimizeSidebar ? (
              <img src="/email.png" className="object-cover w-1/4" />
            ) : (
              <p>
                Email
                <span className="absolute right-5 text-black">
                  {!emailDropdown ? (
                    <FontAwesomeIcon
                      icon={faCaretRight}
                      size={"lg"}
                      color="black"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      size={"lg"}
                      color="black"
                    />
                  )}
                </span>
              </p>
            )}
          </button>
          {emailDropdown && (
            <ul className="transition-all duration-500 ease-in-out">
              <Link href={"/email/inbox"}>
                <li
                  className="mb-5 pl-5 cursor-pointer p-2 relative hover:bg-gray-100"
                  onClick={() => {
                    window.localStorage.setItem(
                      "currentDash",
                      CurrentDash.Email
                    );
                    setEmailDropdown(!emailDropdown);
                  }}
                >
                  Inbox
                </li>
              </Link>
              <Link href={"/email/sent"}>
                <li
                  className="mb-5 pl-5 cursor-pointer p-2 relative hover:bg-gray-100"
                  onClick={() => {
                    window.localStorage.setItem(
                      "currentDash",
                      CurrentDash.Email
                    );
                    setEmailDropdown(!emailDropdown);
                  }}
                >
                  Sent
                </li>
              </Link>

              <Link href={"/email/create"}>
                <li
                  className="mb-5 pl-5 cursor-pointer p-2 relative hover:bg-gray-100"
                  onClick={() => {
                    window.localStorage.setItem(
                      "currentDash",
                      CurrentDash.Email
                    );
                    setEmailDropdown(!emailDropdown);
                  }}
                >
                  Create
                </li>
              </Link>
            </ul>
          )}
        </li>
        {/* </Link> */}
        <li
          className="mb-5 relative"
          onClick={() => setContractDropdown(!contractDropdown)}
        >
          <button
            // onClick={() => {
            //   window.localStorage.setItem("currentDash", CurrentDash.Email);
            //   setCurrentDash(CurrentDash.Email);
            // }}
            className={`cursor-pointer  text-left w-full p-2 focus:border-l-2 ${
              currentDash === CurrentDash.Contracts
                ? "bg-gray-100 border-l-2 border-yellow-600"
                : "border-none bg-none"
            }`}
          >
            {minimizeSidebar ? (
              <img src="/handshake.png" className="object-cover w-1/4" />
            ) : (
              <p className="w-24">
                Contracts
                <span className="absolute right-5 text-black">
                  {!contractDropdown ? (
                    <FontAwesomeIcon
                      icon={faCaretRight}
                      size={"lg"}
                      color="black"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      size={"lg"}
                      color="black"
                    />
                  )}
                </span>
              </p>
            )}
          </button>
          {contractDropdown && (
            <ul className="transition-all duration-500 ease-in-out">
              <Link href={"/contracts"}>
                <li
                  className="mb-5 pl-5 cursor-pointer p-2 relative hover:bg-gray-100"
                  onClick={() => {
                    window.localStorage.setItem(
                      "currentDash",
                      CurrentDash.Contracts
                    );
                    setEmailDropdown(!contractDropdown);
                  }}
                >
                  Contracts
                </li>
              </Link>
              <Link href={"/contracts/upload"}>
                <li
                  className="mb-5 pl-5 cursor-pointer p-2 relative hover:bg-gray-100"
                  onClick={() => {
                    window.localStorage.setItem(
                      "currentDash",
                      CurrentDash.Contracts
                    );
                    setEmailDropdown(!contractDropdown);
                  }}
                >
                  Upload
                </li>
              </Link>

              {/* <Link href={"/contracts/upload"}>
                <li
                  className="mb-5 pl-5 cursor-pointer p-2 relative hover:bg-gray-100"
                  onClick={() => {
                    window.localStorage.setItem(
                      "currentDash",
                      CurrentDash.Email
                    );
                    setEmailDropdown(!emailDropdown);
                  }}
                >
                  Upload
                </li>
              </Link> */}
            </ul>
          )}
        </li>

        {/* <Link href="/galleries">
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
        </Link> */}
      </ul>
    </div>
  );
};

export default Sidebar;
