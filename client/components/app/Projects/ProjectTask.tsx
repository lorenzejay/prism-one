import axios from "axios";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFirebaseAuth from "../../../hooks/useAuth3";
import { FormType, TaskDetails } from "../../../types/tasksTypes";
import Loader from "../Loader";
import ProjectTaskInput from "./ProjectTaskInput";

const ProjectTask = ({ projectId }: { projectId: number }) => {
  const { authUser } = useFirebaseAuth();

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
  //fetch the tasks associated with this project
  const { data: tasks, isLoading: tasksLoading } = useQuery<
    TaskDetails[] | null
  >(`project-tasks-${authUser?.uid}`, fetchAssociatedTasks);

  return (
    <section className="w-full  mx-auto ">
      {tasksLoading && <Loader />}
      <div className="">
        {tasks &&
          !tasksLoading &&
          tasks.map((task, i) => <ProjectTaskInput taskId={task.id} key={i} />)}
      </div>
    </section>
  );
};

export default ProjectTask;
