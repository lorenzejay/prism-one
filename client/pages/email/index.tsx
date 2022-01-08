import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import AppLayout from "../../components/app/Layout";
import sanitize from "sanitize-html";
import useFirebaseAuth from "../../hooks/useAuth3";
import { Url } from "url";

const Email = () => {
  // const { userId, userToken } = useAuth();
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();
  const { code } = router.query;
  const [response, setResponse] = useState<any>();
  // console.log("code", code);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_KEY;

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
  const signInWithGmailAccount = async () => {
    try {
      if (!authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.get("/api/emails/integrate-gmail", config);
      console.log(data);
      if (data.success) {
        return data.data;
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
      console.log(data);
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
      }
      return data.success;
    }
  };

  const { data: integrationStatus, refetch: refireCheckIntegration } =
    useQuery<boolean>(
      `gmail-integration-status-${authUser?.uid}`,
      checkIfYouIntegratedGmail,
      { retry: 1 }
    );
  const { refetch: triggerFetchUrl } = useQuery<string>(
    `gmail-redirect-url-${authUser?.uid}`,
    signInWithGmailAccount2,
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: async (data) => {
        console.log(code);
        if (data && code) {
          const x = await signInWithGmailAccount2();
          setResponse(x);
        }
      },
    }
  );
  const { data: finshGmailIntegration, refetch: fireFinishGmailIntegration } =
    useQuery<boolean>(
      `gmail-second-query-${authUser?.uid}`,
      finishIntegrateGmail,
      {
        retry: true,
      }
    );

  // const { data: redirectUrl, refetch } = useQuery<Url>(
  //   `redirectUrl-${authUser?.uid}`,
  //   signInWithGmailAccount,
  //   { refetchOnWindowFocus: false, enabled: false }
  // );
  const handleFetchUrl = async () => {
    const url = await triggerFetchUrl();
    console.log(url);
    if (url?.data) {
      router.push(url.data);
    }
  };

  useEffect(() => {
    if (code) {
      console.log("code", code);
      const data = fireFinishGmailIntegration();
      setResponse(data);

      // refireCheckIntegration();
    }
  }, [code]);
  useEffect(() => {
    if (integrationStatus) {
      router.push("/email/inbox");
    }
  }, [integrationStatus]);

  console.log("finshGmailIntegration", finshGmailIntegration);
  console.log("integrationStatus", integrationStatus);
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
