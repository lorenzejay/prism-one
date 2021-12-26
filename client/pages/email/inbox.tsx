import React, { useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import AppLayout from "../../components/app/Layout";
import sanitize from "sanitize-html";
import Loader from "../../components/app/Loader";
import ErrorMessage from "../../components/app/ErrorMessage";
import useFirebaseAuth from "../../hooks/useAuth3";

const Inbox = () => {
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

  const checkIfYouIntegratedGmail = async () => {
    try {
      const { data } = await axios.get("/api/emails/check-integration-status");
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
    // if (!integrationStatus)
    //   return window.alert(
    //     "You have not integrated google api how are you even here?"
    //   );

    const { data } = await axios.get("/api/emails/fetch-messages", config);
    console.log(data.data);
    return data.data;
  };
  const { data: integrationStatus, isLoading } = useQuery<boolean>(
    `gmail-integration-status-${authUser?.uid}`,
    checkIfYouIntegratedGmail
  );
  const {
    data: emails,
    isLoading: loadingEmails,
    error: fetchingEmailError,
  } = useQuery<any[]>(`emails-${authUser?.uid}`, fetchMailbox);
  console.log("integrationStatus", integrationStatus);

  if (!isLoading && integrationStatus) {
    return (
      <AppLayout>
        <>
          <p>You have integrated gmail.</p>
          <h2>Emails</h2>
          {fetchingEmailError && (
            <ErrorMessage error={fetchingEmailError as string} />
          )}
          {loadingEmails ? (
            <Loader />
          ) : (
            <table className="border-collapse ">
              <thead>
                <th className="text-left">Recieved</th>
                <th className="text-left">From</th>
                <th className="text-left">Message</th>
                <th className="text-left">Etc</th>
              </thead>
              <tbody className="text-sm">
                {emails &&
                  emails.map((e, i) => {
                    const sanitizeHtml = sanitize(e.snippet);
                    const date = new Date(parseInt(e.internalDate) * 1000);

                    const dateObj: { name: string; value: string } =
                      e.payload.headers.find((e: any) => e.name === "Date");
                    const emailFromObj: { name: string; value: string } =
                      e.payload.headers.find((e: any) => e.name === "From");

                    return (
                      <Link href={`/email/view/${e.id}`} key={i}>
                        <tr className="border cursor-pointer">
                          {e.payload.headers && dateObj && (
                            <td className="border">
                              {dateObj.value.slice(0, 16)}
                              {/* {e.payload.headers.find((e: any) => e.name === "Date")} */}
                            </td>
                          )}
                          <td className="border">{emailFromObj.value}</td>
                          <td
                            className="border"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml.slice(0, 20),
                            }}
                          ></td>
                          <td className="border">placeholder x</td>
                        </tr>
                      </Link>
                    );
                  })}
              </tbody>
            </table>
          )}
        </>
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

export default Inbox;
