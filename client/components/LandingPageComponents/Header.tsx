import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import useFirebaseAuth from "../../hooks/useAuth3";
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
      className={`px-5 py-4 lg:py-6 2xl:py-10 lg:px-12 xl:px-32 flex items-center justify-between  md:justify-start  text-white ${
        scrollPosition > 1 ? "sticky top-0 z-50" : "relative"
      }`}
      style={{ background: "#1E1E1E" }}
    >
      <Link href="/">
        <h3 className="text-2xl lg:text-3xl font-bold mr-5 tracking-widest cursor-pointer">
          PRISM ONE
        </h3>
      </Link>

      {process.env.NEXT_PUBLIC_NODE_ENV === "development" ? (
        <ul className="justify-between absolute right-5 lg:right-12 xl:right-32 text-white text-lg lg:text-2xl p-3">
          In Development
        </ul>
      ) : !authUser?.uid ? (
        <ul className="flex items-center justify-between absolute right-5 lg:right-12 xl:right-32 text-black  p-3">
          <li style={{ background: "#F7FAFC" }} className="p-3 mr-1 rounded-md">
            <Link href="/sign-in">Sign In</Link>
          </li>
          <li style={{ background: "#F9BF52" }} className="p-3 mr-1 rounded-md">
            <Link href="/register">Sign Up</Link>
          </li>
        </ul>
      ) : (
        <ul className="flex items-center justify-between absolute right-5 lg:right-12 xl:right-32 text-black  p-3">
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
