import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import useFirebaseAuth from "../../../hooks/useAuth3";

const UserProfileCircle = ({ name }: { name: string | string[] }) => {
  const { authUser } = useFirebaseAuth();
  // Queries
  const getUserDetails = async () => {
    try {
      if (!authUser?.token) return;
      if (name !== "me") return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.get("/api/users/get-fullname", config);
      if (data.data) {
        return data.data;
      }
    } catch (error) {
      return error;
    }
  };
  const { data: userFullName, isError } = useQuery<string>(
    `username-${authUser?.uid}`,
    getUserDetails
  );

  return (
    <p className="w-10 h-10 text-white mr-1 bg-gray-400 text-center flex items-center justify-center text-xl rounded-full ">
      {name !== "me"
        ? name
        : typeof userFullName === "string"
        ? userFullName.split(" ").map((name) => name.slice(0, 1).toUpperCase())
        : ""}
    </p>
  );
};

export default UserProfileCircle;
