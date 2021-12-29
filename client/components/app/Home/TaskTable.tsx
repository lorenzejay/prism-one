import axios from "axios";
import Link from "next/link";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFirebaseAuth from "../../../hooks/useAuth3";
import { FormType, TaskDetails } from "../../../types/tasksTypes";
import Loader from "../Loader";

const TaskTable = () => {
  const queryClient = useQueryClient();
  //   const router = useRouter();
  const { authUser } = useFirebaseAuth();
  //fetch the tasks
  const fetchTasks = async () => {
    if (!authUser?.token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    const { data } = await axios.get("/api/tasks/list-tasks", config);
    return data.data;
  };
  const {
    data: tasks,
    isLoading: loadingTasks,
    error: fetchingTaskError,
  } = useQuery<TaskDetails[]>(`tasks-${authUser?.uid}`, fetchTasks);
  const updateTaskStatus = async ({
    taskId,
    currentStatus,
  }: {
    taskId: Number;
    currentStatus: FormType;
  }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser?.token,
        },
      };
      const newStatus =
        currentStatus === FormType.completed
          ? FormType.incomplete
          : FormType.completed;

      await axios.post(
        `/api/tasks/update-task-status/${taskId}`,
        { newStatus },
        config
      );
    } catch (error) {
      console.log(error);
    }
  };
  const { mutateAsync: handleUpdateTaskStatus } = useMutation(
    updateTaskStatus,
    {
      onSuccess: () => queryClient.invalidateQueries(`tasks-${authUser?.uid}`),
    }
  );
  return (
    <div className="flex flex-col w-full mb-10">
      <h2 className="tracking-wide text-xl font-semibold">Tasks</h2>
      <div
        className=" p-3 2xl:mt-6 rounded-md"
        style={{ background: "#f0f0f0" }}
      >
        {loadingTasks && <Loader />}
        {tasks?.map((task) => (
          <div
            key={task.id}
            className={`flex items-center shadow-2xl bg-white my-2 rounded-md p-5 ${
              task.status === FormType.completed
                ? "line-through opacity-50"
                : "opacity-100"
            }`}
          >
            <input
              type="checkbox"
              className="mr-3"
              onClick={(e) => {
                e.target;
                handleUpdateTaskStatus({
                  taskId: task.id,
                  currentStatus: task.status,
                });
              }}
              defaultChecked={task.status === FormType.completed ? true : false}
              id={task.id.toString()}
              name={task.description}
            />
            <Link href={`/tasks/${task.id}`}>
              <p className="cursor-pointer">{task.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTable;
