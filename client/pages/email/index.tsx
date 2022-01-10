import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import AppLayout from "../../components/app/Layout";
import useFirebaseAuth from "../../hooks/useAuth3";

const Email = () => {
  // const { userId, userToken } = useAuth();
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);
  const signInWithGmailAccount2 = async () => {
    try {
      // console.log("clicked");
      if (!authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.get("/api/google-auth/get-auth-url", config);
      if (data) {
        console.log("triggered in backend", data);
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

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

      return data.success;
    } catch (error) {
      console.log(error);
    }
  };
  const finishIntegrateGmail = async () => {
    if (!authUser?.token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    if (code) {
      const { data } = await axios.post(
        `/api/google-auth/integrate-gmail-final`,
        {
          code,
        },
        config
      );
      if (data.success) {
        await refireCheckIntegration();
      } else {
        throw Error("Unsuccessfully integrated gmail :(");
      }
      return data.success;
    }
  };

  const { data: integrationStatus, refetch: refireCheckIntegration } =
    useQuery<boolean>(
      `gmail-integration-status-${authUser?.uid}`,
      checkIfYouIntegratedGmail
    );
  const { refetch: triggerFetchUrl } = useQuery<string>(
    `gmail-redirect-url-${authUser?.uid}`,
    signInWithGmailAccount2,
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: async (data) => {
        // console.log(code);
        if (data && code) {
          const x = await signInWithGmailAccount2();
        }
      },
    }
  );

  const {
    data: finshGmailIntegration,
    refetch: fireFinishGmailIntegration,
    isError,
    isSuccess,
  } = useQuery<boolean>(
    `gmail-second-query-${authUser?.uid}`,
    finishIntegrateGmail
  );

  // const { data: redirectUrl, refetch } = useQuery<Url>(
  //   `redirectUrl-${authUser?.uid}`,
  //   signInWithGmailAccount,
  //   { refetchOnWindowFocus: false, enabled: false }
  // );
  const handleFetchUrl = async () => {
    const url = await triggerFetchUrl();

    if (url?.data) {
      router.push(url.data);
    }
  };

  useEffect(() => {
    if (code) {
      const response = fireFinishGmailIntegration();
      console.log("mutation response", response);

      // refireCheckIntegration();
    }
  }, [code]);
  useEffect(() => {
    if (integrationStatus) {
      router.push("/email/inbox");
    }
  }, [integrationStatus]);

  console.log("finshGmailIntegration", finshGmailIntegration);
  console.log("isIntegratonSucess", isSuccess);
  console.log("integrationError", isError);
  return !integrationStatus ? (
    <AppLayout>
      <>
        <h1>Email</h1>
        <button className="flex flex-col items-center" onClick={handleFetchUrl}>
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
  // return (
  //   <AppLayout>
  //     <div>
  //       <h1>Email</h1>
  //       <button className="flex flex-col items-center" onClick={handleFetchUrl}>
  //         <img src="/gmail_logo.png" className="w-24" />
  //         Integrate Gmail
  //       </button>
  //     </div>
  //   </AppLayout>
  // );
};

export default Email;
