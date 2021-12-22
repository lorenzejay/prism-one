import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { useAuth } from "../../../hooks/useAuth";
import Link from "next/link";
import { ProjectDetails } from "../../../types/projectTypes";
import Loader from "../Loader";

const ProjectsTable = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { userId, userToken } = useAuth();
  const fetchProjects = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userToken,
      },
    };
    const { data } = await axios.get("/api/projects/list-projects", config);
    return data.data;
  };
  const {
    data: projects,
    isLoading: loadingProjects,
    error: fetchingProjectError,
  } = useQuery<ProjectDetails[]>(`projects-${userId}`, fetchProjects);
  return (
    <table
      className=" h-1/2 mb-5 rounded-md  p-5  flex-grow "
      style={{ background: "#ffffff" }}
    >
      <thead>
        <tr className="text-left  font-bold underline">
          <th className="px-3">Job Name</th>
          <th className="px-3">Job Type</th>
          <th className="px-3">Status</th>
          <th className="px-3">Date</th>
          <th className="px-3">Action</th>
        </tr>
      </thead>
      {loadingProjects && <Loader />}
      <tbody>
        {projects &&
          projects.map((project, i) => (
            <Link href={`/projects/${project.id}`} key={i}>
              <tr
                className="px-1 rounded-md w-full shadow-2xl bg-white text-sm cursor-pointer"
                style={{ height: 40 }}
              >
                <td className="px-3 rounded-tl-md rounded-bl-md">
                  <p className="py-2">{project.title}</p>
                </td>
                <td className="px-1  ">{project.job_type}</td>
                <td className=" px-1 ">{project.project_status}</td>
                <td className=" px-1  ">
                  {!project.created_at
                    ? project.project_date.slice(0, 10)
                    : project.created_at.slice(0, 10)}
                </td>
                <td className=" px-3  rounded-tr-md rounded-br-md text-center">
                  ...
                </td>
              </tr>
            </Link>
          ))}
      </tbody>
    </table>
  );
};

export default ProjectsTable;