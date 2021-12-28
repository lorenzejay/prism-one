import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AppLayout from "../../components/app/Layout";
import ReactMde, { Suggestion, SaveImageHandler } from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import Head from "next/head";
import sanitize from "sanitize-html";
import { useRouter } from "next/router";
import useFirebaseAuth from "../../hooks/useAuth3";
import Script from "next/script";

const Create = () => {
  const queryClient = useQueryClient();
  const { authUser } = useFirebaseAuth();
  const [emailFrom, setEmailFrom] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTab, setSelectedTab] = React.useState<"write" | "preview">(
    "write"
  );
  const router = useRouter();
  //react mde stuff
  const loadSuggestions = async (text: string) => {
    return new Promise<Suggestion[]>((accept, reject) => {
      setTimeout(() => {
        const suggestions: Suggestion[] = [
          {
            preview: "Prism One",
            value: "@prism",
          },
          {
            preview: "Lorenze | Prism One CRM ",
            value: "@Lorenze",
          },
        ].filter((i) => i.preview.toLowerCase().includes(text.toLowerCase()));
        accept(suggestions);
      }, 250);
    });
  };
  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });

  // console.log(message);

  const checkIfYouIntegratedGmail = async () => {
    try {
      const { data } = await axios.get("/api/emails/check-integration-status");

      return data.data;
    } catch (error) {
      console.log(error);
    }
  };
  const { data: integrationStatus } = useQuery(
    `gmail-integration-status-${authUser?.uid}`,
    checkIfYouIntegratedGmail
  );

  useEffect(() => {
    if (integrationStatus) {
      setEmailFrom(integrationStatus);
    }
  }, [integrationStatus]);
  console.log("integrationStatus", integrationStatus);
  console.log("emailFrom", emailFrom);
  //santize message out
  const sendEmail = async (e: FormEvent) => {
    e.preventDefault();
    const sanitizeHtml = sanitize(message);
    if (sanitizeHtml === "" || sanitizeHtml === "")
      return window.alert("Body cannot be empty");
    await axios.post("/api/emails/send-email", {
      subject,
      from: emailFrom,
      to: emailTo,
      body: sanitizeHtml,
    });
    setEmailTo("");
    setMessage("");
  };

  const {
    mutateAsync: handleSendEmail,
    isLoading,
    isSuccess,
  } = useMutation(sendEmail, {
    onSuccess: () => queryClient.invalidateQueries(`emails-${authUser?.uid}`),
  });

  useEffect(() => {
    if (isSuccess && !isLoading) {
      router.push("/email/inbox");
    }
  }, [isSuccess, isLoading, router]);
  return (
    <AppLayout>
      <>
        <Head>
          <Script src="/path/to/showdown/src/showdown.js"></Script>
          <Script src="/path/to/xss/dist/xss.min.js"></Script>
          <Script src="/path/to/showdown-xss-filter.js"></Script>
        </Head>
        <h3 className="font-bold text-2xl mb-3 ">Create Email</h3>
        <form
          className="flex flex-col justify-start"
          onSubmit={handleSendEmail}
        >
          <label htmlFor="emailFrom" className="text-lg">
            From:
          </label>
          <input
            name="emailFrom"
            className="rounded-md p-2 mb-4  "
            value={emailFrom}
          />
          <label htmlFor="emailTo" className="text-lg">
            To:
          </label>
          <input
            name="emailTo"
            className="rounded-md p-2 mb-4  "
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
          />
          <label htmlFor="subject" className="text-lg">
            Subject:
          </label>
          <input
            name="subject"
            className="rounded-md p-2 mb-4  "
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <ReactMde
            value={message}
            onChange={setMessage}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(markdown) =>
              Promise.resolve(converter.makeHtml(markdown))
            }
            loadSuggestions={loadSuggestions}
            childProps={{
              writeButton: {
                tabIndex: -1,
              },
            }}
            // paste={{
            //   saveImage: save,
            // }}
          />
          <div className="w-full flex justify-end mt-3 text-white">
            <button className="p-2 w-24 rounded-md bg-red-500">Cancel</button>
            <button className="p-2 w-24 rounded-md bg-blue-500 mx-3">
              Save Draft
            </button>
            <button className="p-2 w-24 rounded-md bg-blue-theme" type="submit">
              Send
            </button>
          </div>
        </form>
      </>
    </AppLayout>
  );
};

export default Create;
