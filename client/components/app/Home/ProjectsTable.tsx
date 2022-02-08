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
    const { data } = await axios.get(
      "/api/projects/list-recent-5-projects",
      config
    );
    return data.data;
  };

  const { data: projects, isLoading: loadingProjects } = useQuery<
    ProjectDetails[]
  >(`projects-${authUser?.uid}`, fetchProjects);
  return (
    <div>
      <h2 className="tracking-wide text-2xl  font-medium">Job List</h2>

      <table
        className="w-full min-h-1/4   overflow-x-auto text-sm lg:text-base h-auto mb-5 rounded-md  p-5  "
        style={{ background: "#f0f0f0" }}
      >
        <thead>
          <tr className=" text-left font-bold ">
            <th className="lg:w-1/3 px-3">Job Name</th>
            {/* <th className="w-1/5 px-3">Job Type</th> */}
            <th className="lg:w-1/6 px-3">Status</th>
            <th className="lg:w-1/6 px-3">Date</th>
            <th className="lg:w-1/6 px-3">Action</th>
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
                  className="rounded-md w-full  shadow-2xl bg-white text-sm cursor-pointer "
                  style={{ height: 40 }}
                >
                  <td className="p-2 lg:p-3 rounded-tl-md rounded-bl-md">
                    <p className="    py-2  overflow-hidden">{project.title}</p>
                  </td>
                  {/* <td className="w-1/5 px-3">
                  <p className="px-1  my-auto h-full ">
                    {project.job_type || ""}
                  </p>
                </td> */}
                  <td className="p-2 lg:p-3">
                    <p className=" overflow-hidden">
                      {project.project_status || ""}
                    </p>
                  </td>
                  <td className=" p-2 lg:p-3">
                    <p className="w-full text-left">
                      {!project.created_at
                        ? project.project_date.slice(0, 10)
                        : project.created_at.slice(0, 10)}
                    </p>
                  </td>
                  <td className="p-2 lg:p-3  rounded-tr-md rounded-br-md">
                    <p className="   flex text-center overflow-hidden">...</p>
                  </td>
                </tr>
              </Link>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
