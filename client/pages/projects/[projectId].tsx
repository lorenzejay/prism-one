import axios from "axios";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ProjectDetailsForm from "../../components/app/Projects/projectDetails";
import { useAuth } from "../../hooks/useAuth";
import { ProjectDetails, ProjectStatus } from "../../types/projectTypes";
import { TaskDetails } from "../../types/tasksTypes";
import { ClientDetails, FormType, ApiCallReturn } from "../../types/userTypes";
import Link from "next/link";

const Project = () => {
  const router = useRouter();
  const { projectId } = router.query;
  // const queryClient = useQueryClient();
  const { userId, userToken } = useAuth();

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
    }
  }, [userId]);

  const fetchProjectDetails = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userToken,
      },
    };
    if (!projectId) return;
    const { data } = await axios.get(
      `/api/projects/project-details/${projectId}`,
      config
    );
    return data.data;
  };
  const { data: projectDetails } = useQuery<ProjectDetails>(
    `client-details-${projectId}`,
    fetchProjectDetails
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
    </>
  );
};

export default Project;
