import axios from "axios";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import useFirebaseAuth from "../../hooks/useAuth3";
import { ClientDetails, FormType, ApiCallReturn } from "../../types/userTypes";

interface ClientFormTypes {
  formType: FormType;
  clientDetails?: ClientDetails | null;
  clientId?: string;
}
const ClientForm = ({ formType, clientDetails, clientId }: ClientFormTypes) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { authUser, loading } = useFirebaseAuth();
  const [notes, setNotes] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  useEffect(() => {
    if (clientDetails) {
      setClientName(clientDetails.client_name);
      setEmail(clientDetails.client_email);
      setPhoneNumber(clientDetails.phone_number);
      setAddress(clientDetails.address);
      setCity(clientDetails.city);
      setState(clientDetails.state);
      setZipCode(clientDetails.zip_code);
      setNotes(clientDetails.notes);
    }
  }, [clientDetails]);

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

  const createClient = async (e: FormEvent) => {
    if (!authUser?.token) return;
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    const { data } = await axios.post<{
      data: undefined;
      message: String;
      success: boolean;
    }>(
      "/api/clients/create-client",
      {
        client_name: clientName,
        client_email: email,
        phone_number: phoneNumber,
        notes,
        address,
        city,
        state,
        zip_code: zipCode,
      },
      config
    );
    if (data.success === true) {
      return router.push("/clients");
    }
    window.alert("Something went wrong");
  };
  const { mutateAsync: handleAddNewClient } = useMutation(createClient, {
    onSuccess: () =>
      queryClient.invalidateQueries(`users_clients-${authUser?.uid}`),
  });

  const updateClientDetails = async (e: FormEvent) => {
    e.preventDefault();
    if (!authUser?.token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser?.token,
      },
    };
    await axios.post(
      `/api/clients/update-client-details/${clientId}`,
      {
        client_name: clientName,
        client_email: email,
        phone_number: phoneNumber,
        notes,
        address,
        city,
        state,
        zip_code: zipCode,
      },
      config
    );
  };

  const deleteContact = async () => {
    if (!authUser?.token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact?"
    );
    if (!confirmDelete) return;
    if (!clientId || !authUser.token) return;

    const { data } = await axios.delete<ApiCallReturn>(
      `/api/clients/delete-client/${clientId}`,
      config
    );
    if (data.success) {
      router.push("/clients");
    }
  };
  const { mutateAsync: handleUpdateClients, isLoading } = useMutation(
    updateClientDetails,
    {
      onSuccess: () =>
        queryClient.invalidateQueries(
          `client-details-${clientId}-${authUser?.uid}`
        ),
    }
  );
  const { mutateAsync: handleDeleteClient } = useMutation(deleteContact, {
    onSuccess: () =>
      queryClient.invalidateQueries(`users_clients-${authUser?.uid}`),
  });
  return (
    <form
      className="w-full px-5 py-3 lg:w-1/2 mx-auto font-light flex flex-col text-black bg-white "
      onSubmit={
        formType === FormType.create ? handleAddNewClient : handleUpdateClients
      }
    >
      {isLoading && <div className="loader mx-auto"></div>}
      <h3 className="text-3xl font-semibold my-3">Contacts</h3>
      <div className="flex flex-col my-2">
        <label htmlFor="FirstAndLastName">First and Last Name</label>
        <input
          onChange={(e) => setClientName(e.target.value)}
          value={clientName}
          name="FirstAndLastName"
          className="rounded-md p-2 border outline-none"
        />
      </div>
      <div className="flex flex-col my-2">
        <label htmlFor="email">Email Address</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          name="email"
          className="rounded-md p-2 border outline-none"
          type="text"
        />
      </div>
      <div className="flex flex-col my-2">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          onChange={(e) => setPhoneNumber(e.target.value)}
          value={phoneNumber}
          name="phoneNumber"
          className="rounded-md p-2 border outline-none"
          type="text"
        />
      </div>

      <div className="flex flex-col my-2">
        <label htmlFor="address">Address</label>
        <input
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          name="address"
          className="rounded-md p-2 border outline-none"
          type="text"
        />
      </div>
      <div className="flex flex-col my-2">
        <label htmlFor="city">City</label>
        <input
          onChange={(e) => setCity(e.target.value)}
          value={city}
          name="city"
          className="rounded-md p-2 border outline-none"
          type="text"
        />
      </div>
      <div className="flex flex-col my-2">
        <label htmlFor="state">State</label>
        <input
          onChange={(e) => setState(e.target.value)}
          value={state}
          name="state"
          className="rounded-md p-2 border outline-none"
          type="text"
        />
      </div>
      <div className="flex flex-col my-2">
        <label htmlFor="state">Zip</label>
        <input
          onChange={(e) => setZipCode(e.target.value)}
          value={zipCode}
          name="state"
          className="rounded-md p-2 border outline-none"
          type="text"
        />
      </div>
      <div className="flex flex-col my-2">
        <label htmlFor="notes">Notes</label>
        <textarea
          name="notes"
          className="p-2 rounded-md my-2 border outline-none"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        ></textarea>
        {formType === FormType.details && (
          <button
            type="button"
            onClick={() => handleDeleteClient()}
            className="text-red-600 mr-auto rounded-md transition duration-500 ease-in-out hover:text-red-900"
          >
            Delete Contact
          </button>
        )}
      </div>

      <button
        className="ml-auto hover:bg-yellow-400 transition-all duration-300  lg:w-1/4 rounded-md text-white p-2 my-2"
        style={{ background: "#F88946" }}
        type={"submit"}
      >
        Save
      </button>
    </form>
  );
};

export default ClientForm;
