import React, { useEffect } from "react";
import AppLayout from "../components/app/Layout";
import GoogleLogin from "react-google-login";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const Email = () => {
  const { userId, userToken } = useAuth();
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_KEY;
  const responseGoogle = (res: any) => {
    console.log(res);
    console.log(res.profileObj);
  };

  useEffect(() => {
    if (!userToken) {
      router.push("/sign-in");
    }
  }, [userToken]);

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

  const fetchMailbox = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userToken,
      },
    };
    if (!integrationStatus)
      return window.alert(
        "You have not integrated google api how are you even here?"
      );

    const { data } = await axios.get("/api/emails/fetch-messages", config);
    console.log(data.data);
    return data.data;
  };
  const { data: integrationStatus } = useQuery<boolean>(
    `gmail-integration-status-${userId}`,
    checkIfYouIntegratedGmail
  );
  const { data: emails } = useQuery<any[]>(`emails-${userId}`, fetchMailbox);
  console.log(emails);
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
        <table>
          <thead>
            <th>Recieved</th>
            <th>From</th>
            <th>Message</th>
            <th>Etc</th>
          </thead>
          {emails &&
            emails.map((e) => {
              const date = new Date(parseInt(e.internalDate) * 1000);
              const month = date.getMonth();

              const dateObj: { name: string; value: string } =
                e.payload.headers.find((e: any) => e.name === "Date");
              const emailFromObj: { name: string; value: string } =
                e.payload.headers.find((e: any) => e.name === "From");

              return (
                <tbody className="">
                  <>
                    {e.payload.headers && (
                      <td>
                        {dateObj.value.slice(0, 16)}
                        {/* {e.payload.headers.find((e: any) => e.name === "Date")} */}
                      </td>
                    )}
                    <td>{emailFromObj.value}</td>
                    <td dangerouslySetInnerHTML={{ __html: e.snippet }}></td>
                    <td>{e.snippet}</td>
                  </>
                </tbody>
              );
            })}
        </table>
      </>
    </AppLayout>
  );
};

export default Email;
