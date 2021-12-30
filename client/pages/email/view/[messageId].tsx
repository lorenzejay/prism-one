import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import sanitize from "sanitize-html";
import AppLayout from "../../../components/app/Layout";
import useFirebaseAuth from "../../../hooks/useAuth3";
import { SpecificEmailType } from "../../../types/emailTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
import ReplyEmail from "../../../components/app/Email/ReplyEmail";
import "react-mde/lib/styles/css/react-mde-all.css";
import Head from "next/head";
config.autoAddCss = false;

const SpecificEmail = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { authUser, loading } = useFirebaseAuth();
  const { messageId } = router.query;

  const [revealReply, setRevealReply] = useState(false);

  const [emailSubject, setEmailSubject] = useState("");
  const [emailFrom, setEmailFrom] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailDate, setEmailDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

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

  const replyToEmail = async () => {
    if (!authUser?.token || !messageId || !message || !specificEmailData)
      return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    await axios.post(
      "/api/emails/reply-to-message",
      {
        subject: specificEmailData.emailSubject.value,
        from: specificEmailData.emailTo.value,
        messageId: specificEmailData.messageId.value,
        to: specificEmailData.emailFrom.value,
        body: message,
        threadId: specificEmailData.emailThreadId,
      },
      config
    );
  };
  const {
    mutateAsync: handleRelpyToEmail,
    isLoading: replyingToEmailLoading,
    isSuccess: replyingToEmailSuccess,
  } = useMutation(replyToEmail, {
    onSuccess: () =>
      queryClient.invalidateQueries(`users_clients-${authUser?.uid}`),
  });

  useEffect(() => {
    if (!integrationStatus && !isLoading) {
      router.push("/email/inbox");
    }
  }, [integrationStatus, isLoading]);

  //show - email from , email to, subject, body - content, date
  //payload.headers: Delivered-to, Date, Subject,
  //body.data
  const getHowManydaysAgo = () => {
    if (specificEmailData) {
      const dateFrom = new Date(specificEmailData.emailDate.value);
      const dateToday = new Date();
      // Do the math.
      var millisecondsPerDay = 1000 * 60 * 60 * 24;
      var millisBetween = dateToday.getTime() - dateFrom.getTime();
      var days = millisBetween / millisecondsPerDay;
      return Math.floor(days);
    }
  };

  // console.log("emaildetails", specificEmailData);
  return (
    <AppLayout>
      <>
        <Head>
          <style>{dom.css()}</style>
        </Head>
        {specificEmailData && (
          <div>
            <h2 className="text-3xl font-normal pb-3 border-b">
              {specificEmailData.emailSubject.value}
            </h2>
            <div className=" w-full flex items-center justify-between">
              <p>From: {specificEmailData.emailFrom.value}</p>
              <div className="flex items-center">
                <p className="mr-4">
                  {specificEmailData.emailDate.value.slice(0, 17)}{" "}
                  {`( ${
                    getHowManydaysAgo() === 0
                      ? "Today"
                      : `${getHowManydaysAgo()?.toString()} days ago`
                  }  )`}
                </p>
                <FontAwesomeIcon
                  icon={faReply}
                  className="cursor-pointer"
                  onClick={() => setRevealReply(true)}
                />
              </div>
            </div>

            <p className="mb-10 text-sm text-gray-500">
              To: {specificEmailData.emailTo.value}
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: sanitize(specificEmailData.emailBody),
              }}
            ></div>
          </div>
        )}
        {revealReply && (
          <ReplyEmail
            message={message}
            setMessage={setMessage}
            replyToEmail={handleRelpyToEmail}
          />
        )}
      </>
    </AppLayout>
  );
};

export default SpecificEmail;
