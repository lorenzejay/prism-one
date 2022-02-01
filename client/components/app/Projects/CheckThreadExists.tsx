import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import sanitize from "sanitize-html";
import useFirebaseAuth from "../../../hooks/useAuth3";
import { ThreadDataResult } from "../../../types/projectTypes";
import Loader from "../Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import ReplyEmail from "../Email/ReplyEmail";
import { queryClient } from "../../../utils/queryClient";

interface CheckThreadExistsProps {
  projectId: string;
  isThread: boolean;
  setIsThread: (x: boolean) => void;
  clients?: any[];
}
const CheckThreadExists = ({
  projectId,
  isThread,
  setIsThread,
  clients,
}: CheckThreadExistsProps) => {
  const { authUser } = useFirebaseAuth();
  const [lastMessageId, setLastMessageId] = useState("");
  const [replyToThread, setReplyToThread] = useState(false);
  const [message, setMessage] = useState("");
  const [specificEmailData, setSpecificEmailData] = useState<ThreadDataResult>(
    {} as ThreadDataResult
  );

  const replyToEmail = async () => {
    if (!authUser?.token || !message || !specificEmailData) return;
    console.log("replying to thread here", specificEmailData);
    console.log("lastMessageId", lastMessageId);
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    const { data } = await axios.post(
      "/api/google-auth/reply-to-message",
      {
        subject: specificEmailData.emailSubject.value,
        from: specificEmailData.emailTo.value,
        messageId: lastMessageId,
        to: specificEmailData.emailFrom.value,
        body: message,
        threadId: specificEmailData.emailThreadId,
      },
      config
    );
    if (data.success) {
      return setReplyToThread(false);
    }
  };
  const { mutateAsync: handleRelpyToEmail, isLoading: replyingToEmailLoading } =
    useMutation(replyToEmail, {
      onSuccess: () =>
        queryClient.invalidateQueries(
          `project-email-thread-${authUser?.token}-${projectId}`
        ),
    });

  const checkIfThreadExists = async () => {
    if (!authUser?.token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    const { data } = await axios.get(
      `/api/google-auth/get-threadId/${projectId}`,
      config
    );

    if (data.success) {
      setIsThread(true);
      return data.data;
    } else {
      setIsThread(false);
      return null;
    }
  };
  //fetch the thread associated with this project if any else false/null
  const {
    data: thread,
    isLoading: threadLoading,
    isError: fetchingThreadIdError,
  } = useQuery<ThreadDataResult[]>(
    `project-email-thread-${authUser?.token}-${projectId}`,
    checkIfThreadExists
  );

  useEffect(() => {
    if (thread) {
      //last index of messages
      // console.log("thread", thread);
      setSpecificEmailData(thread[thread.length - 1]);
      const lastMessageId = thread[thread.length - 1].messageId;
      if (lastMessageId) {
        setLastMessageId(lastMessageId.value);
      }
    }
  }, [thread]);

  const [minimize, setMinimize] = useState<"minimize" | "open">("open");
  return (
    <div className={`${isThread ? "" : "hidden"}`}>
      <h2 className="relative text-3xl  font-medium mt-10 mb-8 tracking-wide">
        Messages
        <span
          className="absolute right-0"
          onClick={() => setMinimize(minimize === "open" ? "minimize" : "open")}
        >
          <FontAwesomeIcon
            icon={minimize === "open" ? faCaretDown : faCaretRight}
          />
        </span>
      </h2>
      <section
        className={`${
          minimize === "minimize" ? "hidden " : "block"
        } transition-all duration-200 `}
      >
        {threadLoading && <Loader />}
        {thread &&
          thread.map((x, i) => {
            // console.log("message", x);

            const sender = x?.emailFrom?.value;
            // const messageId = x.messageId.value;

            const emailType = x.inReplyTo;
            return (
              <div
                className={`${
                  emailType ? "ml-4" : ""
                } rounded-md w-full bg-white p-3 mb-3`}
                key={i}
              >
                <p>
                  {emailType && <span> ^</span>}
                  {sender}
                </p>

                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitize(x.emailBody),
                  }}
                ></div>
              </div>
            );
          })}
        {replyingToEmailLoading && <Loader />}

        {!replyToThread && (
          <button className="ml-4" onClick={() => setReplyToThread(true)}>
            Reply
          </button>
        )}
        {replyToThread && (
          <button className="ml-4" onClick={() => setReplyToThread(false)}>
            Close
          </button>
        )}
        {replyToThread && (
          <div className={`ml-4 mb-16`}>
            <ReplyEmail
              message={message}
              setMessage={setMessage}
              replyToEmail={handleRelpyToEmail}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default CheckThreadExists;
