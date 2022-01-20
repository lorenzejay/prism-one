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
import Modal from "../../components/app/Modal";
import CreateProjectForm from "../../components/app/Projects/CreateProjectForm";
const Clients = () => {
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();

  const [clientSearched, setClientSearched] = useState<string>("");
  const [showCreateProject, setShowCreateProject] = useState(false);

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
    window.localStorage.setItem("currentDash", "Clients");
  }, [loading, authUser]);

  //list all clients out here

  const handleGetUserClients = async () => {
    try {
      if (!authUser?.token) return;
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
          className={`relative px-10 py-5 min-h-full `}
          style={{
            background: "#F9F9F9",
          }}
        >
          <section className="z-1 relative my-7 flex items-center justify-start font-light   ">
            {/* {showCreateProject && (
              <div className="w-full z-10 pt-7  bg-black flex items-center justify-center h-full fixed top-0 left-0 overflow-auto">
                <div
                  className={`z-20 bg-white opacity-100 p-4 w-1/2 h-96 mx-auto  rounded-md ${
                    showCreateProject && "opacity-100"
                  }`}
                >
                  <button onClick={() => setShowCreateProject(false)}>X</button>
                  <h2>Create</h2>
                </div>
              </div>
            )} */}
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

          <table className="w-full border border-collapse p-3">
            <thead>
              <tr className="text-left  ">
                <th className="w-1/4 border p-3 bg-white font-normal">Name</th>
                <th className="w-1/4 border p-3 bg-white font-normal">Email</th>
                <th className="w-1/4 border p-3 bg-white font-normal">
                  Phone Number
                </th>
                <th className="w-1/4 border p-3 bg-white font-normal">
                  Project
                </th>
              </tr>
            </thead>
            <tbody>
              {clientSearched === "" &&
                clients &&
                clients.map((client, i) => (
                  // <Link href={`/clients/${client.id}`} key={i}>
                  <tr className=" bg-white border rounded-md mt-3" key={i}>
                    <td className="p-3 border ">{client.client_name}</td>
                    <td className="p-3 border ">{client.client_email}</td>
                    <td className="p-3 border ">{client.phone_number}</td>

                    <td className="p-3 border ">
                      {client.associatedProjectId !== null ? (
                        <Link href={`/projects/${client.associatedProjectId}`}>
                          <p>{client.associatedProjectId}</p>
                        </Link>
                      ) : (
                        <Modal
                          modalName={"New Project"}
                          contentWidth="lg:w-1/2"
                          contentHeight="h-auto"
                        >
                          <div className="bg-white p-10  overflow-y-auto rounded-md">
                            <CreateProjectForm
                              defaultClientEmail={client.client_email}
                              defaultClientName={client.client_name}
                            />
                          </div>
                        </Modal>
                      )}
                    </td>
                  </tr>
                  // </Link>
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
