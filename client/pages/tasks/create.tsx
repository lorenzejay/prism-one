import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import AppLayout from "../../components/app/Layout";
import "react-mde/lib/styles/css/react-mde-all.css";
import Head from "next/head";
import { useRouter } from "next/router";
import useFirebaseAuth from "../../hooks/useAuth3";
import Link from "next/link";
import SelectAssociatedProject from "../../components/app/Task/SelectAssociatedProject";
import Script from "next/script";

const Create = () => {
  const queryClient = useQueryClient();
  const { authUser } = useFirebaseAuth();
  const [description, setDescription] = useState("");
  const [projectAssociated, setProjectAssociated] = useState<number>();
  const [taskDate, setTaskDate] = useState("");

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
    if (!authUser?.token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    const { data } = await axios.post(
      "/api/tasks/create-task",
      {
        description,
        project_associated: projectAssociated,
        due_date: taskDate,
      },
      config
    );
    if (data.success) {
      router.push("/tasks");
    }
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

  console.log("project date", taskDate);
  return (
    <AppLayout>
      <>
        <Head>
          <Script src="/path/to/showdown/src/showdown.js"></Script>
          <Script src="/path/to/xss/dist/xss.min.js"></Script>
          <Script src="/path/to/showdown-xss-filter.js"></Script>
        </Head>
        <h3 className="font-bold text-2xl mb-3 ">Create Tasks</h3>
        <form
          className="flex flex-col justify-start"
          onSubmit={handleCreateTask}
        >
          <label htmlFor="Description" className="text-lg">
            Description:
          </label>
          <input
            name="Description"
            className="rounded-md p-2 mb-4  "
            value={description}
            type="text"
            onChange={(e) => setDescription(e.target.value)}
          />

          <SelectAssociatedProject
            createMode={true}
            projectAssociated={projectAssociated}
            setProjectAssociated={setProjectAssociated}
          />
          <div className="flex flex-col my-2">
            <label htmlFor="ProjectDate">Project Date</label>

            <input
              type="date"
              name="ProjectDate"
              className="p-2 rounded-md "
              defaultValue={getTodaysDate()}
              onChange={(e) => {
                setTaskDate(e.target.value);
              }}
            />
          </div>

          <div className="w-full flex justify-end mt-3 text-white">
            <Link href="/tasks">
              <button className="p-2 w-24 mr-3 rounded-md bg-red-500">
                Cancel
              </button>
            </Link>

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
