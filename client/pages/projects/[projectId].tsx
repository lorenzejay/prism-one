import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ProjectDetailsForm from "../../components/app/Projects/projectDetails";
import { ProjectDetails } from "../../types/projectTypes";
import Link from "next/link";
import useFirebaseAuth from "../../hooks/useAuth3";
import { FormType, TaskDetails } from "../../types/tasksTypes";

const Project = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { projectId } = router.query;
  // const queryClient = useQueryClient();
  const { authUser, loading } = useFirebaseAuth();

  useEffect(() => {
    if (!authUser && !loading) {
      router.push("/home");
    }
  }, [authUser, loading]);

  const fetchProjectDetails = async () => {
    if (!authUser?.token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };

    const { data } = await axios.get(
      `/api/projects/project-details/${projectId}`,
      config
    );
    return data.data;
  };

  //get the tasks associated with the project
  const fetchAssociatedTasks = async () => {
    try {
      if (!authUser?.token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.get(
        `/api/projects/list-project-tasks/${projectId}`,
        config
      );
      if (data.success) {
        return data.data;
      }
    } catch (error) {
      return error;
    }
  };

  const { data: projectDetails } = useQuery<ProjectDetails>(
    `project-details-${authUser?.uid}-${projectId}`,
    fetchProjectDetails
  );
  const { data: tasks } = useQuery<TaskDetails[]>(
    `project-tasks-${authUser?.uid}-${projectId}`,
    fetchAssociatedTasks
  );

  // console.log("tasks", tasks);
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
      onSuccess: () => queryClient.invalidateQueries(`tasks`),
    }
  );
  return (
    <>
      <Link href="/projects">
        <h3 className="cursor-pointer w-full mx-auto lg:w-1/2 pt-10 text-gray-600 hover:text-black transition ease-in-out duration-500">
          Return
        </h3>
      </Link>
      {projectId && (
        <ProjectDetailsForm
          projectDetails={projectDetails}
          projectId={projectId?.toString()}
        />
      )}
      <section className="w-full px-5 py-3 lg:w-1/2 mx-auto ">
        <h3 className="text-3xl mb-5 tracking-wide ">Tasks</h3>
        {(!tasks || tasks?.length === 0) && <p>No tasks</p>}
        <ul className="">
          {tasks &&
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center shadow-2xl bg-white my-2 rounded-md p-5 "
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
    </>
  );
};

export default Project;
