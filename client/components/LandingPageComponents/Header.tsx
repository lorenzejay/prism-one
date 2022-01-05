import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import useFirebaseAuth from "../../hooks/useAuth3";
import Dropdown from "./Dropdown";
//old colors:
//#F4F3F1
const Header = ({ toggle }: { toggle: () => void }) => {
  const { authUser, signOut } = useFirebaseAuth();
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // console.log("userId", userId);

  return (
    <nav
      className={`px-5 py-4 lg:py-6 2xl:py-10 lg:px-12 xl:px-32 flex items-center justify-between   text-white ${
        scrollPosition > 1 ? "sticky top-0 z-50" : "relative"
      }`}
      style={{ background: "#1E1E1E" }}
    >
      <Link href="/">
        <h3 className="text-2xl lg:text-3xl font-bold mr-5 tracking-widest cursor-pointer">
          PRISM ONE
        </h3>
      </Link>

      {/* <ul className="text-white w-48 items-center hidden md:flex md:justify-between">
        <li>
          <Dropdown title="Features">
            <div>
              <h4 className="text-black text-base font-semibold">
                Lead Generator
              </h4>
              <p className="font-thin text-sm text-gray-400">
                Organize all your leads into one platform.
              </p>
            </div>
            <div className="mt-1">
              <h4 className="text-black text-base font-semibold">
                Gmail Integration
              </h4>
              <p className="font-thin text-sm text-gray-400">
                Send and view emails in the CRM.
              </p>
            </div>
            <div className="mt-1">
              <h4 className="text-black text-base font-semibold">
                Organization
              </h4>
              <p className="font-thin text-sm text-gray-400">
                Organize your upcoming projects, clients and tasks.
              </p>
            </div>
          </Dropdown>
        </li>
        <li>
          <Link href="/pricing">
            <p>Pricing</p>
          </Link>
        </li>
        <li>
          <Link href="/features">
            <p>More</p>
          </Link>
        </li>
      </ul> */}

      <div
        onClick={toggle}
        className="block text-white text-2xl cursor-pointer md:hidden "
      >
        <FontAwesomeIcon icon={faBars} size="sm" />
      </div>
      {process.env.NEXT_PUBLIC_NODE_ENV === "development" ? (
        <ul className="hidden md:block justify-between relative right-5 lg:right-12 xl:right-32 text-white text-lg lg:text-2xl p-3 ">
          In Development
        </ul>
      ) : !authUser?.uid ? (
        <ul className="hidden md:flex items-center justify-between absolute right-5 lg:right-12 xl:right-32 text-black  p-3">
          <li style={{ background: "#F7FAFC" }} className="p-3 mr-1 rounded-md">
            <Link href="/sign-in">Sign In</Link>
          </li>
          <li style={{ background: "#F9BF52" }} className="p-3 mr-1 rounded-md">
            <Link href="/register">Sign Up</Link>
          </li>
        </ul>
      ) : (
        <ul className="hidden md:flex items-center justify-between absolute right-5 lg:right-12 xl:right-32 text-black  p-3">
          <li style={{ background: "#F7FAFC" }} className="p-2 mr-1 rounded-md">
            <button onClick={signOut}>Logout</button>
          </li>
        </ul>
      )}
      {/* </ul> */}
    </nav>
  );
};

export default Header;
