import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import ProjectDetailsForm from "../../components/app/Projects/projectDetails";
import { ProjectDetails } from "../../types/projectTypes";
import Link from "next/link";
import useFirebaseAuth from "../../hooks/useAuth3";
import { TaskDetails } from "../../types/tasksTypes";
import ProjectTask from "../../components/app/Projects/ProjectTask";

const Project = () => {
  const router = useRouter();
  const { projectId } = router.query;
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

  const { data: projectDetails, isLoading: pDetailsLoading } =
    useQuery<ProjectDetails>(
      `project-details-${authUser?.uid}-${projectId}`,
      fetchProjectDetails
    );
  const { data: tasks, isLoading: tasksLoading } = useQuery<
    TaskDetails[] | null
  >(`project-tasks-${authUser?.uid}-${projectId}`, fetchAssociatedTasks);

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
      {tasks && <ProjectTask tasks={tasks} taskLoading={tasksLoading} />}

      {tasks === null && (
        <section className="w-1/2 mx-auto">
          <h3 className="text-3xl mb-5 tracking-wide ">Tasks</h3>

          <p className="">No tasks</p>
        </section>
      )}
    </>
  );
};

export default Project;
