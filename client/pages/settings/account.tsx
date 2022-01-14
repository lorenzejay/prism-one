import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import AppLayout from "../../components/app/Layout";
import useFirebaseAuth from "../../hooks/useAuth3";
import { UserDetails } from "../../types/userTypes";

const Account = () => {
  const [fName, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  //   const [phoneNumber, setPhoneNumber] = useState("");
  //   const [address, setAddress] = useState("");

  const { authUser } = useFirebaseAuth();
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
  useEffect(() => {
    if (userDetails) {
      setFname(`${userDetails.first_name} ${userDetails.last_name}`);
      setEmail(userDetails.email);
      setIndustry(userDetails.companyDetails[0].industry);
    }
  }, [userDetails]);

  return (
    <AppLayout>
      <section className="px-10 py-5 lg:px-32">
        <h2 className="text-3xl tracking-wide">Settings</h2>

        <div className="flex justify-between">
          {userDetails && (
            <div className="rounded-full bg-gray-500 text-white text-4xl mr-4 w-36 h-36 flex items-center justify-center">
              <p> {userDetails.first_name.slice(0, 1)}</p>
            </div>
          )}
          <div className="rounded-md bg-white p-3 w-3/4">
            <h3 className="text-2xl mb-3">Account Info</h3>

            <div className="flex items-center  ">
              <div className="flex flex-col  mr-10">
                <label className="text-lg" htmlFor="FullName">
                  Full Name:
                </label>
                <input
                  id="FullName"
                  className="border-b-2 outline-none"
                  defaultValue={fName}
                  onChange={(e) => setFname(e.target.value)}
                />
              </div>
              <div className="flex flex-col ">
                <label className="text-lg" htmlFor="Industry">
                  Industry
                </label>
                <input
                  id="Industry"
                  className="border-b-2"
                  defaultValue={industry.replace("_", " ")}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default Account;
