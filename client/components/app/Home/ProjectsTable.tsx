import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import Link from "next/link";
import { ProjectDetails } from "../../../types/projectTypes";
import Loader from "../Loader";
import useFirebaseAuth from "../../../hooks/useAuth3";

const ProjectsTable = () => {
  const { authUser } = useFirebaseAuth();
  const fetchProjects = async () => {
    if (!authUser?.token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    const { data } = await axios.get("/api/projects/list-projects", config);
    return data.data;
  };

  const { data: projects, isLoading: loadingProjects } = useQuery<
    ProjectDetails[]
  >(`projects-${authUser?.uid}`, fetchProjects);
  return (
    <table
      className="w-full table-auto flex flex-col overflow-x-auto text-sm lg:text-base h-auto mb-5 rounded-md  p-5  "
      style={{ background: "#ffffff" }}
    >
      <thead>
        <tr className="w-full text-left font-bold underline">
          <th className="w-1/5 px-3">Job Name</th>
          <th className="w-1/5 px-3">Job Type</th>
          <th className="w-1/5 px-3">Status</th>
          <th className="w-1/5 px-3">Date</th>
          <th className="w-1/5 px-3">Action</th>
        </tr>
      </thead>
      {loadingProjects && <Loader />}
      {projects?.length === 0 && <p>You have no jobs.</p>}
      <tbody>
        {projects &&
          projects.length !== 0 &&
          projects.map((project, i) => (
            <Link href={`/projects/${project.id}`} key={i}>
              <tr
                className="px-1 rounded-md w-full  shadow-2xl bg-white text-sm cursor-pointer "
                style={{ height: 40 }}
              >
                <td className="w-1/5">
                  <p className="px-3  rounded-tl-md rounded-bl-md py-2  overflow-hidden">
                    {project.title}
                  </p>
                </td>
                <td className="w-1/5 ">
                  <p className="px-1  my-auto h-full ">
                    {project.job_type || ""}
                  </p>
                </td>
                <td className="w-1/5 ">
                  <p className="px-1  overflow-hidden">
                    {project.project_status || ""}
                  </p>
                </td>
                <td className="w-1/5  ">
                  <p className="px-1  w-full">
                    {!project.created_at
                      ? project.project_date.slice(0, 10)
                      : project.created_at.slice(0, 10)}
                  </p>
                </td>
                <td className="w-1/5 ">
                  <p className="px-3  rounded-tr-md rounded-br-md text-center  overflow-hidden">
                    ...
                  </p>
                </td>
              </tr>
            </Link>
          ))}
      </tbody>
    </table>
  );
};

export default ProjectsTable;
