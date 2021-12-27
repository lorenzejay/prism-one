import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Head from "next/head";
import Link from "next/link";
import { ClientDetails } from "../../types/userTypes";
import Loader from "../../components/app/Loader";
import { useRouter } from "next/router";
import AppLayout from "../../components/app/Layout";
import useFirebaseAuth from "../../hooks/useAuth3";
const Clients = () => {
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();
  const [clientSearched, setClientSearched] = useState<string>("");

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

  //list all clients out here

  const handleGetUserClients = async () => {
    try {
      if (!authUser?.token) return;
      console.log("authtoken,", authUser.token);
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser?.token,
        },
      };
      const { data } = await axios.get("/api/clients/list-clients", config);
      return data.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const handleSearchClient = async () => {
    try {
      if (clientSearched === "") return null;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser?.token !== null && authUser?.token,
        },
      };
      if (clientSearched !== null || clientSearched !== "") {
        const { data } = await axios.get(
          `/api/clients/client-filter-by-name/${clientSearched}`,
          config
        );
        return data.data;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const {
    data: clients,
    isLoading,
    error,
  } = useQuery<ClientDetails[]>(
    `users_clients-${authUser?.uid}`,
    handleGetUserClients
  );
  const {
    data: searchedClients,
    isLoading: loadingSearchedClient,
    error: searchingError,
  } = useQuery<ClientDetails[] | null>(
    `searched-users_clients-${authUser?.uid}-${clientSearched}`,
    handleSearchClient
  );

  //create a handle search and use that on the onchange
  // console.log("clients", clients);
  // console.log("searched", searchedClients);
  // console.log("clientSearched", clientSearched);
  return (
    <AppLayout>
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
            <thead>
              <tr className="p-2 text-left  ">
                <th className="w-1/3 font-normal">Name</th>
                <th className="w-1/3 font-normal">Email</th>
                <th className="w-1/3 font-normal">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {clientSearched === "" &&
                clients &&
                clients.map((client, i) => (
                  <Link href={`/clients/${client.id}`} key={i}>
                    <tr className="cursor-pointer bg-white border rounded-md mt-3">
                      <td className="p-3">{client.client_name}</td>
                      <td className="p-3">{client.client_email}</td>
                      <td className="p-3">{client.phone_number}</td>
                    </tr>
                  </Link>
                ))}
              {clientSearched !== "" &&
                clientSearched &&
                searchedClients?.map((client: ClientDetails, i: number) => (
                  <Link href={`/clients/${client.id}`} key={i}>
                    <tr className="cursor-pointer bg-white border rounded-md mt-3">
                      <td className="p-3">{client.client_name}</td>
                      <td className="p-3">{client.client_email}</td>
                      <td className="p-3">{client.phone_number}</td>
                    </tr>
                  </Link>
                ))}
            </tbody>
          </table>
        </div>
      </>
    </AppLayout>
  );
};

export default Clients;
