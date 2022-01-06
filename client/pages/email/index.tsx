import React, { useEffect } from "react";
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
  // console.log("code", code);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_KEY;

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

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
        "/api/emails/check-integration-status",
        config
      );
      return data.success;
    } catch (error) {
      console.log(error);
    }
  };
  const finishIntegrateGmail = async () => {
    if (!authUser?.token) return;
    // console.log("intgreating function 2");
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    if (code) {
      const { data } = await axios.post(
        `/api/emails/integrate-gmail-2/`,
        {
          code,
        },
        config
      );
      if (data.success) {
        await refireCheckIntegration();
      }
      return data;
    }
  };

  const { data: integrationStatus, refetch: refireCheckIntegration } =
    useQuery<boolean>(
      `gmail-integration-status-${authUser?.uid}`,
      checkIfYouIntegratedGmail
    );
  const { data: finshGmailIntegration, refetch: fireFinishGmailIntegration } =
    useQuery<boolean>(
      `gmail-second-query-${authUser?.uid}`,
      finishIntegrateGmail
    );

  const { data: redirectUrl, refetch } = useQuery<Url>(
    `redirectUrl-${authUser?.uid}`,
    signInWithGmailAccount,
    { refetchOnWindowFocus: false, enabled: false }
  );
  const handleFetchUrl = async () => {
    const url = await refetch();
    console.log(url);
    if (url?.data) {
      router.push(url.data);
    }
  };

  useEffect(() => {
    if (integrationStatus) {
      router.push("/email/inbox");
    }
  }, [integrationStatus]);
  useEffect(() => {
    if (code) {
      // console.log("code", code);
      fireFinishGmailIntegration();
      refireCheckIntegration();
    }
  }, [code, router.query, redirectUrl]);
  // console.log("integrationStatus", integrationStatus);
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
  //       <button
  //         className="flex flex-col items-center"
  //         onClick={handleFetchUrl}
  //       >
  //         <img src="/gmail_logo.png" className="w-24" />
  //         Integrate Gmail
  //       </button>
  //     </div>
  //   </AppLayout>
  // );
};

export default Email;
