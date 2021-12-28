import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import useFirebaseAuth from "../../hooks/useAuth3";

const AppHeader = () => {
  const { authUser, signOut } = useFirebaseAuth();
  // const queryClient = useQueryClient();
  const [openDropdown, setOpenDropdown] = useState(false);

  // Queries

  const getUserFirstName = async () => {
    try {
      if (!authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.get("/api/users/get-firstname", config);

      return data;
    } catch (error) {
      return error;
    }
  };
  const { data: user } = useQuery<{
    success: boolean;
    message: string | undefined;
    data: string;
  }>(`users_firstname-${authUser?.uid}`, getUserFirstName);

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
        <button className="" onClick={() => setOpenDropdown(!openDropdown)}>
          <span className="font-bold">Welcome ,</span> {user?.data}
        </button>
        {openDropdown && (
          <div className="absolute top-10 bg-gray-100 p-3 shadow-2xl ">
            <button onClick={signOut}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppHeader;
