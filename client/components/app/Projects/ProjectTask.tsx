import axios from "axios";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import useFirebaseAuth from "../../../hooks/useAuth3";
import { FormType, TaskDetails } from "../../../types/tasksTypes";
import Loader from "../Loader";

const ProjectTask = ({
  tasks,
  taskLoading,
}: {
  tasks: TaskDetails[];
  taskLoading: boolean;
}) => {
  const { authUser } = useFirebaseAuth();

  const queryClient = useQueryClient();

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
    <section className="w-full px-5 py-3 lg:w-1/2 mx-auto ">
      <h3 className="text-3xl mb-5 tracking-wide ">Tasks</h3>

      {taskLoading && <Loader />}
      <ul className="">
        {tasks &&
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center shadow-2xl bg-white my-2 rounded-md p-5 ${
                task.status === FormType.completed
                  ? "line-through opacity-50"
                  : ""
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
                defaultChecked={
                  task.status === FormType.completed ? true : false
                }
                id={task.id.toString()}
                name={task.description}
              />
              <label htmlFor={task.description}>{task.description}</label>
            </div>
          ))}
      </ul>
    </section>
  );
};

export default ProjectTask;
