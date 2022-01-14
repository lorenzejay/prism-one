import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import ClientForm from "../../components/app/ClientForm";
import Layout from "../../components/LandingPageComponents/Layout";
import { ClientDetails, FormType } from "../../types/userTypes";
import Link from "next/link";
import useFirebaseAuth from "../../hooks/useAuth3";
import AppLayout from "../../components/app/Layout";
const ClientPage = () => {
  const { authUser, loading } = useFirebaseAuth();

  const router = useRouter();
  const { clientId } = router.query;

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

  const fetchClientDetails = async () => {
    if (!authUser?.token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    const { data } = await axios.get(
      `/api/clients/client-details/${clientId}`,
      config
    );
    return data;
  };

  const checkIfYouIntegratedGmail = async () => {
    try {
      if (!authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.get(
        "/api/google-auth/check-integration-status",
        config
      );

      return data.success;
    } catch (error) {
      throw new Error("You are not integrated.");
    }
  };
  const {
    data: integrationStatus,
    isSuccess,
    isError,
  } = useQuery<boolean>(
    `gmail-integration-status-${authUser?.uid}`,
    checkIfYouIntegratedGmail
  );

  const { data: details } = useQuery<{
    success: boolean;
    message: string | undefined;
    data: ClientDetails;
  }>(`client-details-${clientId}-${authUser?.uid}`, fetchClientDetails);

  console.log("details", details);
  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row justify-start p-5 ">
        <main className="lg:w-2/3 pr-10 border-b-2 pb-10 lg:pb-10 lg:border-b-0 lg:border-r-2">
          <div className="">
            <Link href="/clients">
              <h3 className="cursor-pointer w-full mx-auto  pt-10 text-gray-600 hover:text-black transition ease-in-out duration-500">
                Return to list
              </h3>
            </Link>
            {details && clientId && (
              <ClientForm
                clientDetails={details.data}
                formType={FormType.details}
                clientId={clientId.toString()}
              />
            )}
          </div>
        </main>
        <section className="lg:w-1/2  mx-auto p-5">
          <h3 className="text-3xl flex-grow ">Automations</h3>
          <div className="flex items-center  justify-between">
            <p>Must be integrated to gmail to setup automations</p>
            {integrationStatus ? (
              <p className="bg-green-500 rounded-md p-2 integrated">
                Integrated
              </p>
            ) : (
              <p className="bg-red-500 rounded-md p-2 integrated">
                Not Integrated
              </p>
            )}
          </div>

          <ul className="w-full mt-10">
            <li className="flex justify-between">
              <p>After 30 mins of client creation.</p>
              <select>
                <option>None</option>
                <option>Introductory Email</option>
              </select>
            </li>
          </ul>
        </section>
      </div>
    </AppLayout>
  );
};

export default ClientPage;
