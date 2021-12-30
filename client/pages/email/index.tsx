import React, { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import AppLayout from "../../components/app/Layout";
import sanitize from "sanitize-html";
import useFirebaseAuth from "../../hooks/useAuth3";

const Email = () => {
  // const { userId, userToken } = useAuth();
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_KEY;

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

  const signInWithGmailAccount = async () => {
    try {
      const { data } = await axios.get("/api/emails/integrate-gmail");

      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const checkIfYouIntegratedGmail = async () => {
    try {
      const { data } = await axios.get("/api/emails/check-integration-status");
      return data.success;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: integrationStatus } = useQuery<boolean>(
    `gmail-integration-status-${authUser?.uid}`,
    checkIfYouIntegratedGmail
  );
  useEffect(() => {
    if (integrationStatus) {
      router.push("/email/inbox");
    }
  }, [integrationStatus]);
  return !integrationStatus ? (
    <AppLayout>
      <>
        <h1>Email</h1>
        <button
          className="flex flex-col items-center"
          onClick={signInWithGmailAccount}
        >
          <img src="/gmail_logo.png" className="w-24" />
          Integrate Gmail
        </button>

        {/* {clientId && (
              <GoogleLogin
              clientId={clientId}
              buttonText="Sign In with your gmail"
              onSuccess={(res) => console.log(res)}
              onFailure={(err) => console.log(err)}
              cookiePolicy={"single_host_origin"}
              isSignedIn={true}
              />
            )} */}
      </>
    </AppLayout>
  ) : (
    <AppLayout>
      <>
        <p>You have integrated gmail.</p>
        <h2>Emails</h2>
      </>
    </AppLayout>
  );
};

export default Email;
