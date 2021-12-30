import axios from "axios";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AppLayout from "../../components/app/Layout";
import useFirebaseAuth from "../../hooks/useAuth3";
import { FormType, TaskDetails } from "../../types/tasksTypes";
import Link from "next/link";
import SelectAssociatedProject from "../../components/app/Task/SelectAssociatedProject";
import ErrorMessage from "../../components/app/ErrorMessage";

const Task = () => {
  const router = useRouter();
  const { authUser, loading } = useFirebaseAuth();
  const queryClient = useQueryClient();
  const { taskId } = router.query;

  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<boolean>();
  const [due_date, setDueDate] = useState<Date | string>();
  const [project_associated, setProjectAssociated] = useState<number>();
  const [project_title, setProjectTitle] = useState<string>();

  const [cursorHoveringDescription, setCursorHoveringDescription] =
    useState(false);
  const [editingDescription, setEditingDescription] = useState(false);

  const getTodaysDate = () => {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      time = d.toLocaleTimeString();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-") + `T${time.slice(0, 8)}`;
  };

  //get project title of project id
  const getProjectTitle = async () => {
    const { data } = await axios.get(
      `/api/projects/project-title/${project_associated}`
    );
    if (data.success) {
      return data.data;
    }
  };

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

  //fetch this task
  const listTask = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser?.token !== null && authUser?.token,
      },
    };
    const { data } = await axios.get(
      `/api/tasks/list-specific-task/${taskId}`,
      config
    );
    if (data.success) {
      return data.data;
    }
  };

  const updateTaskStatus = async (e: FormEvent) => {
    if (!authUser?.token) return;
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    await axios.post(
      `/api/tasks/update-task-details/${taskId}`,
      {
        description,
        due_date,
        project_associated,
        status,
      },
      config
    );
  };
  const { data: task } = useQuery<TaskDetails>(
    `task-${authUser?.uid}-${taskId}`,
    listTask
  );
  //
  const getProjectToAssociateTaskTo = async () => {
    if (!authUser?.token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    const { data } = await axios.get(
      "/api/tasks/list-associated-projects",
      config
    );
    return data.data;
  };
  const { data: projects } = useQuery<{ title: string; id: number }[]>(
    `project-association-${authUser?.uid}`,
    getProjectToAssociateTaskTo
  );

  const { data: projectTitle } = useQuery<{ title: string }>(
    `project-title-${project_associated}`,
    getProjectTitle
  );
  const {
    mutateAsync: hanleUpdateTask,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useMutation(updateTaskStatus, {
    onSuccess: () =>
      queryClient.invalidateQueries(`task-${authUser?.uid}-${taskId}`),
  });

  useEffect(() => {
    if (task) {
      setDescription(task.description);
      //non-guarantee to be filled
      setDueDate(task.due_date);
      setProjectAssociated(task.project_associated);
    }
    if (task?.status === FormType.completed) {
      setStatus(true);
    } else {
      setStatus(false);
    }
  }, [task]);

  // console.log("project ass", project_associated);
  return (
    <AppLayout>
      <div>
        {isError && <ErrorMessage error={error as string} />}
        {task && (
          <form
            className="flex flex-col w-full mx-auto lg:w-1/2"
            onSubmit={hanleUpdateTask}
          >
            <Link href="/tasks">
              <h3 className="transition-all ease-in-out duration-500  cursor-pointer  pt-10 text-gray-600 hover:text-black hover:underline">
                Return
              </h3>
            </Link>
            <div
              className="flex "
              onMouseOver={() => setCursorHoveringDescription(true)}
              onMouseLeave={() => setCursorHoveringDescription(false)}
            >
              {!editingDescription ? (
                <h3 className="text-3xl tracking-wide">{description}</h3>
              ) : (
                <input
                  className=" border p-2 my-3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setEditingDescription(false);
                    }
                  }}
                />
              )}
              <button
                className={cursorHoveringDescription ? "block" : "hidden"}
                onClick={() => setEditingDescription(!editingDescription)}
              >
                Edit
              </button>
            </div>
            {due_date && (
              <p className="text-xl my-3 font-semibold">
                Due Date:{" "}
                <span className="ml-2 font-normal">
                  {due_date.toString().slice(0, 10)}
                </span>
              </p>
            )}
            {!due_date && (
              <div className="my-4">
                <label>Set Due Date:</label>
                <input
                  type="datetime-local"
                  className="p-2 rounded-md "
                  defaultValue={getTodaysDate()}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);

                    setDueDate(newDate);
                  }}
                />
              </div>
            )}
            <SelectAssociatedProject
              createMode={false}
              defaultProject={project_associated}
              defaultProjects={projects}
              projectAssociated={project_associated}
              setProjectAssociated={setProjectAssociated}
            />
            <div>
              <label htmlFor="completedStatus">Completed: </label>
              <input
                name="completedStatus"
                className=""
                type="checkbox"
                onChange={() => setStatus(!status)}
                checked={status}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-theme p-1 mt-5 rounded-md text-white w-24"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </AppLayout>
  );
};

export default Task;
