import React, { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import AppLayout from "../../components/app/Layout";
import Loader from "../../components/app/Loader";
import ErrorMessage from "../../components/app/ErrorMessage";
import useFirebaseAuth from "../../hooks/useAuth3";
import EmailTable from "../../components/app/Email/EmailTable";

const Inbox = () => {
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && authUser === null) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

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
      //make them integrate their account if they are not authorized
      if (!data.success) {
        router.push("/email");
      }
      return data.success;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMailbox = async () => {
    if (!authUser?.token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser?.token,
      },
    };

    const { data } = await axios.get("/api/google-auth/fetch-messages", config);
    if (data.success) {
      return data.data;
    }
  };
  const { data: integrationStatus, isLoading } = useQuery<boolean>(
    `gmail-integration-status-${authUser?.uid}`,
    checkIfYouIntegratedGmail,
    { retry: 1 }
  );
  const {
    data: emails,
    isLoading: loadingEmails,
    error: fetchingEmailError,
  } = useQuery<any[]>(`emails-${authUser?.uid}`, fetchMailbox);
  // console.log("integrationStatus", integrationStatus);
  // console.log("emails", emails);
  if (!isLoading && integrationStatus) {
    return (
      <AppLayout>
        <section className="px-10 py-5 bg-gray-theme">
          {/* <h2 className="tracking-wide flex-grow text-3xl font-medium ">
            Emails
          </h2> */}
          {fetchingEmailError && (
            <ErrorMessage error={fetchingEmailError as string} />
          )}
          {loadingEmails ? (
            <Loader />
          ) : (
            <EmailTable
              emails={emails}
              loadingEmails={loadingEmails}
              fetchingEmailError={fetchingEmailError as any}
            />
          )}
        </section>
      </AppLayout>
    );
  } else {
    return (
      <AppLayout>
        <section className="py-5 px-10 bg-gray-theme">
          <h2 className="tracking-wide flex-grow text-3xl font-medium ">
            Emails
          </h2>
          <Loader />
        </section>
      </AppLayout>
    );
  }
};

export default Inbox;
