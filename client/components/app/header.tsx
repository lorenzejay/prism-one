import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import useFirebaseAuth from "../../hooks/useAuth3";
import { UserDetails } from "../../types/userTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
const AppHeader = () => {
  const { authUser, signOut } = useFirebaseAuth();
  // const queryClient = useQueryClient();
  const [openDropdown, setOpenDropdown] = useState(false);

  // Queries
  const getUserDetails = async () => {
    try {
      if (!authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.get("/api/users/user-details", config);
      if (data.success) {
        return data.data;
      }
    } catch (error) {
      return error;
    }
  };
  const { data: userDetails, isError } = useQuery<UserDetails>(
    `user-details-${authUser?.uid}`,
    getUserDetails
  );
  // console.log("userDetails", userDetails?.full_name.split(" "));
  return (
    <nav className="flex relative text-black items-center h-24 py-5 px-12 lg:px-24 w-screen">
      <h3
        className="lg:w-1/6 text-2xl flex-grow tracking-widest uppercase"
        style={{ color: "#F88946" }}
      >
        Prism One
      </h3>
      {/*
      
        <div className="flex items-center flex-grow ">
        <input
          className="border rounded-md p-3 outline-none"
          placeholder="Search Your Jobs...."
        />
        <button
          className="rounded-lg text-white border px-4 py-3"
          style={{ background: "#F88946" }}
        >
          Q
        </button>
        <button
          className=" rounded-lg ml-10 p-3 text-white flex w-36 justify-between items-center"
          style={{ background: "#1D4757" }}
        >
          New Job
          <span
            className="rounded-full p-1 h-7 w-7 flex items-center justify-center"
            style={{ background: "#F88946" }}
          >
            +
          </span>
        </button> 
      </div>
        */}
      <div className="relative">
        {userDetails && !isError && (
          <>
            <button
              className="rounded-full text-white bg-gray-400 w-10 h-10"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              {/* <span className="font-bold">Welcome ,</span> {username} */}
              {userDetails.full_name &&
                userDetails?.full_name
                  .split(" ")
                  .map((name) => name.slice(0, 1).toUpperCase())}
            </button>
          </>
        )}
        {isError && (
          <p className="p-2 rounded-md text-red-600">Something went wrong</p>
        )}
        {openDropdown && userDetails && (
          <div className="flex flex-col absolute top-10 right-0 bg-gray-100 p-3 shadow-2xl rounded-md w-80 z-10">
            <section className="flex border-b-2 py-5 items-center">
              <p className="w-20 h-20 text-white mr-10 bg-gray-400 text-center flex items-center justify-center text-3xl rounded-full ">
                {userDetails.full_name &&
                  userDetails?.full_name
                    .split(" ")
                    .map((name) => name.slice(0, 1).toUpperCase())}
              </p>
              <div className="">
                <p>{userDetails.full_name}</p>
                <p>{userDetails.companyDetails[0].company_name}</p>
              </div>
            </section>
            <div className="p-5">
              <Link href="/settings/account">
                <p className="cursor-pointer flex items-center">
                  <span className="text-gray-500 mr-3">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  My Account
                </p>
              </Link>
              <button
                onClick={signOut}
                className="hover:underline text-sm text-left mt-5 pb-0 w-24 "
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppHeader;
