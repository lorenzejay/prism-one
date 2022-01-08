import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import EmailTable from "../../components/app/Email/EmailTable";
import ErrorMessage from "../../components/app/ErrorMessage";
import AppLayout from "../../components/app/Layout";
import Loader from "../../components/app/Loader";
import useFirebaseAuth from "../../hooks/useAuth3";

const Sent = () => {
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

  const checkIfYouIntegratedGmail = async () => {
    try {
      if (!authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser?.token,
        },
      };

      const { data } = await axios.get(
        "/api/google-auth/check-integration-status",
        config
      );
      return data.success;
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSentMail = async () => {
    if (!authUser?.token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };

    const { data } = await axios.get(
      "/api/google-auth/fetch-sent-messages",
      config
    );
    console.log(data);
    return data.data;
  };
  const { data: integrationStatus, isLoading } = useQuery<boolean>(
    `gmail-integration-status-${authUser?.uid}`,
    checkIfYouIntegratedGmail
  );

  const {
    data: emails,
    isLoading: loadingSentEmails,
    error,
    isError,
  } = useQuery<any[]>(`sent-emails-${authUser?.uid}`, fetchSentMail);

  console.log("integrationStatus", integrationStatus);
  // console.log("isLoading", isLoading);
  // console.log("error", error);
  if (!isLoading && integrationStatus) {
    return (
      <AppLayout>
        <>
          <EmailTable
            emails={emails}
            loadingEmails={loadingSentEmails}
            fetchingEmailError={error as any}
          />
        </>
      </AppLayout>
    );
  } else if (!isLoading && isError) {
    return (
      <AppLayout>
        <ErrorMessage error="Something went wrong." />
      </AppLayout>
    );
  } else {
    return (
      <AppLayout>
        <Loader />
      </AppLayout>
    );
  }
};

export default Sent;
