import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import Head from "next/head";
import Layout from "../../components/LandingPageComponents/Layout";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";
import { ClientDetails } from "../../types/userTypes";
import Loader from "../../components/app/Loader";
import { useRouter } from "next/router";
const Clients = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [clientSearched, setClientSearched] = useState("");
  const [listedClients, setListedClients] = useState<ClientDetails[] | null>();
  const { userToken, userId } = useAuth();

  useEffect(() => {
    if (!userId) router.push("/sign-in");
  }, [userId]);

  //list all clients out here

  const handleGetUserClients = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userToken,
      },
    };
    const { data } = await axios.get("/api/clients/list-clients", config);
    return data;
  };

  const handleSearchClient = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userToken,
      },
    };
    if (clientSearched !== null || clientSearched !== "") {
      const { data } = await axios.get(
        `/api/clients/client-filter-by-name/${clientSearched}`,
        config
      );
      return data;
    }
  };

  const {
    data: clients,
    isLoading,
    error,
  } = useQuery<{
    success: boolean;
    message: string | undefined;
    data: ClientDetails[];
  }>(["users_clients"], handleGetUserClients);
  const {
    data: searchedClients,
    isLoading: loadingSearchedClient,
    error: searchingError,
  } = useQuery<{
    success: boolean;
    message: string | undefined;
    data: ClientDetails[];
  }>(["users_clients", clientSearched], handleSearchClient);

  //create a handle search and use that on the onchange

  return (
    <Layout>
      <>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <div
          className="px-10 py-5 lg:px-32 min-h-full"
          style={{ background: "#F9F9F9" }}
        >
          <section className="my-7 flex items-center justify-start font-light   ">
            <h2 className="flex-grow text-3xl font-medium">Clients</h2>
            <div className="mr-3 flex items-center justify-start  ">
              <input
                placeholder="Seach your client"
                className="bg-white p-2 flex m-0 shadow-2xl"
                onChange={(e) => setClientSearched(e.target.value)}
                value={clientSearched}
              />
              <button className="  z-10 bg-yellow-600 rounded-md p-2">Q</button>
            </div>
            <Link href="/clients/create">
              <button
                className="p-2 rounded-md text-white"
                style={{ background: "#1D4757" }}
              >
                New Client <span className="rounded-full">+</span>
              </button>
            </Link>
          </section>
          {isLoading && <Loader />}
          {clientSearched !== "" && loadingSearchedClient && <Loader />}
          {error && (
            <p className="shadow-2xl text-red bg-white">{error as String}</p>
          )}
          {searchingError && (
            <p className="shadow-2xl text-red bg-white">{error as String}</p>
          )}

          <table className="w-full table-fixed  text-black">
            <tr className="p-2 text-left  ">
              <th className="w-1/3 font-normal">Name</th>
              <th className="w-1/3 font-normal">Email</th>
              <th className="w-1/3 font-normal">Phone Number</th>
            </tr>
            {clientSearched === "" &&
              clients?.data.map((client, i) => (
                <Link href={`/clients/${client.id}`} key={i}>
                  <tr className="cursor-pointer bg-white border rounded-md mt-3">
                    <td className="p-3">{client.client_name}</td>
                    <td className="p-3">{client.client_email}</td>
                    <td className="p-3">{client.phone_number}</td>
                  </tr>
                </Link>
              ))}
            {clientSearched !== "" &&
              searchedClients?.data.map((client: ClientDetails, i: number) => (
                <Link href={`/clients/${client.id}`} key={i}>
                  <tr className="cursor-pointer bg-white border rounded-md mt-3">
                    <td className="p-3">{client.client_name}</td>
                    <td className="p-3">{client.client_email}</td>
                    <td className="p-3">{client.phone_number}</td>
                  </tr>
                </Link>
              ))}
          </table>
        </div>
      </>
    </Layout>
  );
};

export default Clients;
