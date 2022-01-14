import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFirebaseAuth from "../../../hooks/useAuth3";
import { FormType, TaskDetails } from "../../../types/tasksTypes";
interface ProjectTaskInputProps {
  task: TaskDetails;
  projectId: number;
}
const ProjectTaskInput = ({ task, projectId }: ProjectTaskInputProps) => {
  const queryClient = useQueryClient();
  const { authUser } = useFirebaseAuth();
  const [description, setDescription] = useState("");
  const [due_date, setDueDate] = useState("");
  const [checked, setChecked] = useState<FormType>({} as FormType);

  //   const fetchTask = async () => {
  //     try {
  //       if (!authUser?.token) return;
  //       const config = {
  //         headers: {
  //           "Content-Type": "application/json",
  //           token: authUser.token,
  //         },
  //       };
  //       if (!taskId) return;
  //       const { data } = await axios.get(
  //         `/api/tasks/list-specific-task/${taskId}`,
  //         config
  //       );

  //       if (data.success) {
  //         return data.data;
  //       }
  //     } catch (error) {
  //       return error;
  //     }
  //   };
  //   //fetch the tasks associated with this project
  //   const { data: task, isLoading: taskLoading } = useQuery<TaskDetails>(
  //     `task-${taskId}`,
  //     fetchTask
  //   );

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
      setChecked(newStatus);
      await axios.post(
        `/api/tasks/update-task-status/${taskId}`,
        { newStatus },
        config
      );
    } catch (error) {
      console.log(error);
    }
  };
  const { mutateAsync: handleUpdateTaskStatus, isLoading } = useMutation(
    updateTaskStatus,
    {
      onSuccess: () =>
        queryClient.invalidateQueries(`project-tasks-${projectId}`),
    }
  );

  const getDueDate = (date: any) => {
    const dueDate = new Date(date);
    const today = new Date();

    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = dueDate.getTime() - today.getTime();
    var days = millisBetween / millisecondsPerDay;
    return Math.floor(days);
  };

  useEffect(() => {
    if (task) {
      setChecked(task.status);
      setDescription(task.description);
      setDueDate(task.due_date);
    }
  }, [task]);

  return (
    <div
      key={task?.id}
      className={`flex items-center shadow-2xl bg-white my-2 rounded-md p-5 ${
        checked === FormType.completed ? "line-through opacity-50" : ""
      }`}
    >
      {/* {tas && <Loader />} */}
      {task && (
        <>
          <input
            type="checkbox"
            className="mr-3"
            onClick={(e) => {
              handleUpdateTaskStatus({
                taskId: task.id,
                currentStatus: checked,
              });
            }}
            checked={checked === FormType.completed ? true : false}
            id={task.id.toString()}
            name={description}
          />
          <label className="flex-grow" htmlFor={description}>
            {description}
          </label>
          <p
            className={` text-white rounded-md p-2 ${
              getDueDate(due_date) < 10 ? "bg-orange-500" : "bg-green-500"
            }`}
          >
            {getDueDate(due_date) <= 0
              ? "Today"
              : `${getDueDate(due_date)} days left`}
          </p>
        </>
      )}
    </div>
  );
};

export default ProjectTaskInput;
