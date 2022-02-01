import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import ReactMde, { Suggestion } from "react-mde";
import { useMutation, useQuery, useQueryClient } from "react-query";
import sanitize from "sanitize-html";
import Showdown from "showdown";
import useFirebaseAuth from "../../../hooks/useAuth3";
import { ProjectDetails } from "../../../types/projectTypes";
import Dropdown from "../../LandingPageComponents/Dropdown";

const SendEmailsInProjectPage = ({
  projectDetails,
  projectId,
  setIsThread,
}: {
  projectDetails: ProjectDetails;
  projectId: string;
  setIsThread: (x: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  const { authUser } = useFirebaseAuth();
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [selectedTab, setSelectedTab] = React.useState<"write" | "preview">(
    "write"
  );
  useEffect(() => {
    if (projectDetails?.client_email) {
      setEmailTo(projectDetails.client_email);
    }
  }, [projectDetails]);
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
  const checkIfYouIntegratedGmail = async () => {
    try {
      if (!authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser?.token,
        },
      };
      const { data } = await axios.get(
        "/api/google-auth/check-integration-status",
        config
      );

      return data.data;
    } catch (error) {
      console.log(error);
    }
  };
  //check if we can send emails
  const { data: integrationStatus } = useQuery(
    `gmail-integration-status-${authUser?.uid}`,
    checkIfYouIntegratedGmail
  );
  // send emails
  //santize message out
  const sendEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!authUser?.token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser?.token,
      },
    };
    const sanitizeHtml = sanitize(message);
    if (sanitizeHtml === "" || sanitizeHtml === "")
      return window.alert("Body cannot be empty");
    const { data } = await axios.post(
      "/api/google-auth/send-email",
      {
        subject,
        from: integrationStatus,
        to: emailTo,
        body: sanitizeHtml,
      },
      config
    );
    setEmailTo("");
    setSubject("");
    setMessage("");
    if (data.success) {
      //save thread id
      //thread id is inside data.data
      setIsThread(true);
      await axios.post(
        `/api/google-auth/save-threadId/${projectId}`,
        { threadId: data.data },
        config
      );
    }
  };
  // const saveThreadId = async (threadId: string) => {
  //   if (!threadId) return;
  //   const { data } = await axios.get(
  //     `/api/google-auth/get-threadId/${threadId}`
  //   );
  //   if (data.success) {
  //     return data.data;
  //   }
  // };
  const {
    mutateAsync: handleSendEmail,
    isLoading,
    isSuccess,
  } = useMutation(sendEmail, {
    onSuccess: () =>
      queryClient.invalidateQueries(
        `project-threadId-${authUser?.token}-${projectId}`
      ),
  });

  return (
    <form className="" onSubmit={handleSendEmail}>
      {projectDetails && (
        <input
          placeholder="email to"
          defaultValue={emailTo}
          className="w-full p-2 border rounded-t-md"
        />
      )}
      <input
        placeholder="Subject..."
        className="w-full p-2 border"
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
      <div className="p-3 bg-white rounded-b-md pt-3 flex">
        <button
          className="mr-4 rounded-md bg-blue-theme text-white px-3 py-1 disabled:opacity-25 disabled:cursor-not-allowed"
          type="submit"
          disabled={
            emailTo === "" || subject === "" || message === "" ? true : false
          }
        >
          Send
        </button>
        <Dropdown title="Templates">dskal;dka</Dropdown>
      </div>
    </form>
  );
};

export default SendEmailsInProjectPage;
