import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import sanitize from "sanitize-html";
import useFirebaseAuth from "../../../hooks/useAuth3";
import { ThreadDataResult } from "../../../types/projectTypes";
import Loader from "../Loader";
interface CheckThreadExistsProps {
  projectId: string;
  //   thread: ThreadDataResult[] | undefined;
  //   setThread: React.Dispatch<
  //     React.SetStateAction<ThreadDataResult[] | undefined>
  //   >;
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
  } = useQuery<ThreadDataResult>(
    `project-threadId-${authUser?.token}-${projectId}`,
    checkIfThreadExists
  );
  useEffect(() => {
    if (thread) {
      //last index of messages
      const lastMessageId = thread.messages[
        thread.messages.length - 1
      ].payload.headers.find(
        (x: any) => x.name === "Message-Id" || x.name === "Message-ID"
      );
      if (lastMessageId) {
        setLastMessageId(lastMessageId.value);
      }
    }
  }, [thread]);
  console.log("last messageId", lastMessageId);
  return (
    <div>
      <h2 className="text-3xl  font-medium mt-10 mb-8 tracking-wide">
        Messages
      </h2>
      {threadLoading && <Loader />}
      {thread?.messages &&
        thread.messages.map((x, i) => {
          // console.log(x.payload.headers);
          const sender = x.payload.headers.find((x: any) => x.name === "From");
          const messageId = x.payload.headers.find(
            (x: any) => x.name === "Message-Id" || x.name === "Message-ID"
          );

          const emailType = x.payload.headers.find(
            (x: any) => x.name === "In-Reply-To"
          );
          return (
            <div
              className={`${
                emailType ? "ml-4" : ""
              } rounded-md w-full bg-white p-3 mb-3`}
              key={i}
            >
              <p>
                {emailType && <span> ^</span>}
                {sender.value}
              </p>

              <div
                dangerouslySetInnerHTML={{
                  __html: sanitize(x.snippet),
                }}
              ></div>
            </div>
          );
        })}
    </div>
  );
};

export default CheckThreadExists;
