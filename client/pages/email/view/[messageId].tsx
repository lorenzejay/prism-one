import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import sanitize from "sanitize-html";
import AppLayout from "../../../components/app/Layout";
import useFirebaseAuth from "../../../hooks/useAuth3";
import { SpecificEmailType } from "../../../types/emailTypes";

const SpecificEmail = () => {
  const router = useRouter();
  const { authUser, loading } = useFirebaseAuth();
  const { messageId } = router.query;

  const [emailSubject, setEmailSubject] = useState("");
  const [emailFrom, setEmailFrom] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailDate, setEmailDate] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const checkIfYouIntegratedGmail = async () => {
    try {
      const { data } = await axios.get("/api/emails/check-integration-status");

      return data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getSpecificEmail = async () => {
    if (!messageId) return;
    const { data } = await axios.get(
      `/api/emails/fetch-specific-message/${messageId}`
    );
    return data;
  };
  const { data: integrationStatus, isLoading } = useQuery(
    `gmail-integration-status-${authUser?.uid}`,
    checkIfYouIntegratedGmail
  );
  const { data: specificEmailData, isLoading: loadingSpecficEmail } =
    useQuery<SpecificEmailType>(
      `specific-email-${authUser?.uid}-${messageId}`,
      getSpecificEmail
    );
  useEffect(() => {
    if (!integrationStatus && !isLoading) {
      router.push("/email/inbox");
    }
  }, [integrationStatus, isLoading]);

  //show - email from , email to, subject, body - content, date
  //payload.headers: Delivered-to, Date, Subject,
  //body.data

  console.log("specificEmailData", specificEmailData);
  return (
    <AppLayout>
      <>
        {specificEmailData && (
          <div>
            <h2>{specificEmailData.emailSubject.value}</h2>
            <p>{specificEmailData.emailFrom.value}</p>
            <p>{specificEmailData.emailTo.value}</p>
            <div
              dangerouslySetInnerHTML={{
                __html: sanitize(specificEmailData.emailBody),
              }}
            ></div>
          </div>
        )}
      </>
    </AppLayout>
  );
};

export default SpecificEmail;
