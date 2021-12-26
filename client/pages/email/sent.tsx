import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import sanitize from "sanitize-html";
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
      const { data } = await axios.get("/api/emails/check-integration-status");
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
        token: authUser?.token,
      },
    };

    const { data } = await axios.get("/api/emails/fetch-sent-messages", config);
    console.log(data.data);
    return data.data;
  };
  const { data: integrationStatus, isLoading } = useQuery<boolean>(
    `gmail-integration-status-${authUser?.uid}`,
    checkIfYouIntegratedGmail
  );
  const { data: emails } = useQuery<any[]>(
    `sent-emails-${authUser?.uid}`,
    fetchSentMail
  );
  if (!isLoading && integrationStatus) {
    return (
      <AppLayout>
        <>
          <p>You have integrated gmail.</p>
          <h2>Emails</h2>
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
                  const month = date.getMonth();

                  const dateObj: { name: string; value: string } =
                    e.payload.headers.find((e: any) => e.name === "Date");
                  const emailFromObj: { name: string; value: string } =
                    e.payload.headers.find((e: any) => e.name === "From");

                  return (
                    <tr className="border" key={i}>
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
                  );
                })}
            </tbody>
          </table>
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

export default Sent;
