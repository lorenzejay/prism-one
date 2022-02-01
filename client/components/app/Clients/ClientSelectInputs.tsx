import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import useFirebaseAuth from "../../../hooks/useAuth3";
import { ClientDetails } from "../../../types/ClientTypes";
import Loader from "../Loader";
interface ClientSelectInputsProps {
  newClient: string;
  setClient: (x: number) => void;
  id?: string;
}
const ClientSelectInputs = ({
  id,
  newClient,
  setClient,
}: ClientSelectInputsProps) => {
  const { authUser } = useFirebaseAuth();

  const listAllClients = async () => {
    if (!authUser?.token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };

    const { data } = await axios.get("/api/clients/list-all-clients", config);
    if (data.success) {
      return data.data;
    }
  };
  const {
    data: clients,
    isLoading,
    isError,
  } = useQuery<ClientDetails[]>(
    `user-clients-${authUser?.uid}`,
    listAllClients
  );
  return (
    <select
      className="rounded-md p-2 border outline-none disabled:opacity-50"
      onChange={(e) => setClient(parseInt(e.target.value))}
      id={id}
      disabled={newClient !== "" ? true : false}
    >
      <option value={-1}>Select</option>
      {isLoading && <Loader />}
      {clients &&
        clients.map((client: ClientDetails, i) => (
          <option key={i} value={client.id}>
            {client.client_name}
          </option>
        ))}
    </select>
  );
};

export default ClientSelectInputs;
