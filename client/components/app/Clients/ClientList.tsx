import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import useFirebaseAuth from "../../../hooks/useAuth3";
import { ClientDetails } from "../../../types/ClientTypes";
import UserProfileCircle from "../User/UserProfileCircle";
interface ClientListProps {
  projectId: string;
}
const ClientList = ({ projectId }: ClientListProps) => {
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [clientDetail, setClientDetail] = useState<ClientDetails>(
    {} as ClientDetails
  );
  const { authUser } = useFirebaseAuth();
  const fetchProjectClients = async () => {
    if (!authUser?.token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };

    const { data } = await axios.get(
      `/api/projects/list-project-clients/${projectId}`,
      config
    );
    if (data.success) {
      return data.data;
    }
  };
  //get the clients that are on this project => client has a projectassociated
  const { data: projectClients, isLoading: fetchingProjectClientsLoading } =
    useQuery<ClientDetails[]>(
      `project-clients-${authUser?.uid}-${projectId}`,
      fetchProjectClients
    );
  //   const showClientDetails = (client:ClientDetails) => {

  //   };
  return (
    <div className="flex relative">
      {projectClients &&
        projectClients.map((client, i) => (
          <div
            className="relative"
            onMouseEnter={() => {
              setShowClientDetails(true);
              setClientDetail(client);
            }}
            onMouseLeave={() => setShowClientDetails(false)}
            key={i}
          >
            <UserProfileCircle
              name={client.client_name
                .split(" ")
                .map((name) => name.slice(0, 1).toUpperCase())}
            />
          </div>
          //   <p className="w-10 h-10 text-white mr-1 bg-gray-400 text-center flex items-center justify-center text-xl rounded-full" >
          //     {client.client_name
          //       .split(" ")
          //       .map((name) => name.slice(0, 1).toUpperCase())}
          //   </p>
        ))}
      {clientDetail && (
        <div
          className={`bg-white p-3 rounded-md text-xs ${
            showClientDetails ? "absolute right-0 -bottom-12" : "hidden"
          }`}
        >
          <div>{clientDetail.client_name}</div>
          <div>{clientDetail.client_email}</div>
          <div>{clientDetail.phone_number}</div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
