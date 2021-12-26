import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AppLayout from "../../components/app/Layout";
import "react-mde/lib/styles/css/react-mde-all.css";
import Head from "next/head";
import sanitize from "sanitize-html";
import { useRouter } from "next/router";
import useFirebaseAuth from "../../hooks/useAuth3";

const Create = () => {
  const queryClient = useQueryClient();
  const { authUser, loading } = useFirebaseAuth();
  const [emailFrom, setEmailFrom] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [taskDate, setTaskDate] = useState<Date>();

  const getTodaysDate = () => {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      time = d.toLocaleTimeString();

    console.log;
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-") + `T${time.slice(0, 8)}`;
  };
  // console.log("date", getTodaysDate());
  const router = useRouter();

  //santize message out
  const createTask = async (e: FormEvent) => {
    e.preventDefault();
  };

  const {
    mutateAsync: handleCreateTask,
    isLoading,
    isSuccess,
  } = useMutation(createTask, {
    onSuccess: () => queryClient.invalidateQueries(`tasks-${authUser?.uid}`),
  });

  useEffect(() => {
    if (isSuccess && !isLoading) {
      router.push("/tasks");
    }
  }, [isSuccess, isLoading, router]);
  return (
    <AppLayout>
      <>
        <Head>
          <script src="/path/to/showdown/src/showdown.js"></script>
          <script src="/path/to/xss/dist/xss.min.js"></script>
          <script src="/path/to/showdown-xss-filter.js"></script>
        </Head>
        <h3 className="font-bold text-2xl mb-3 ">Create Tasks</h3>
        <form
          className="flex flex-col justify-start"
          onSubmit={handleCreateTask}
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
          <div className="flex flex-col my-2">
            <label htmlFor="projectDate">Project Date</label>

            <input
              type="datetime-local"
              className="p-2 rounded-md "
              defaultValue={getTodaysDate()}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                setTaskDate(newDate);
              }}
            />
          </div>

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
