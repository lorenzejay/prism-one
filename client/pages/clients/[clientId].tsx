import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import ClientForm from "../../components/app/ClientForm";
import Layout from "../../components/LandingPageComponents/Layout";
import { ClientDetails, FormType } from "../../types/userTypes";
import Link from "next/link";
import useFirebaseAuth from "../../hooks/useAuth3";
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
  const { data: details } = useQuery<{
    success: boolean;
    message: string | undefined;
    data: ClientDetails;
  }>(`client-details-${clientId}-${authUser?.uid}`, fetchClientDetails);
  console.log("details:", details);
  return (
    <Layout>
      <main className="flex flex-col justify-start p-5 lg:">
        <Link href="/clients">
          <h3 className="cursor-pointer w-full mx-auto lg:w-1/2 pt-10 text-gray-600 hover:text-black transition ease-in-out duration-500">
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
      </main>
    </Layout>
  );
};

export default ClientPage;
