import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

import Link from "next/link";
import { ProjectDetails } from "../../types/projectTypes";
import AppLayout from "../../components/app/Layout";
import { useRouter } from "next/router";
import useFirebaseAuth from "../../hooks/useAuth3";
const Projects = () => {
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();
  const [projectSearched, setProjectSearched] = useState("");

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

  const getProjects = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser?.token !== null && authUser?.token,
      },
    };
    const { data } = await axios.get("/api/projects/list-projects", config);
    return data.data;
  };
  //query projects
  const { data: projects } = useQuery<ProjectDetails[]>(
    `projects-${authUser?.uid}`,
    getProjects
  );
  console.log("prohect", projects);
  return (
    <AppLayout>
      <section>
        <div className="flex mb-5">
          <h2 className="flex-grow text-3xl font-medium ">Projects</h2>

          <button
            className="p-3 rounded-md text-white"
            style={{ background: "#1D4757" }}
          >
            <Link href="/projects/create">New Project</Link>
          </button>
        </div>
        <div
          className="w-full py-1 my-3"
          style={{ backgroundColor: "#333642" }}
        >
          <div
            className="w-full flex py-2 text-white"
            style={{ background: "#252833" }}
          >
            <button
              style={{ background: "#252833" }}
              className="relative  w-1/6 project-status-arrow  "
            >
              All Active Projects
            </button>
            <button
              style={{ background: "#676B7C" }}
              className=" mr-2 w-1/6 relative project-status-arrow-active"
            >
              Inquiry
            </button>
            <button
              style={{ background: "#333642" }}
              className="  w-1/6 relative project-status-arrow"
            >
              Proposals
            </button>
            <button
              style={{ background: "#333642" }}
              className="  w-1/6 relative project-status-arrow"
            >
              Deposited
            </button>
            <button
              style={{ background: "#333642" }}
              className="p-3  w-1/6 relative project-status-arrow"
            >
              Completed
            </button>
            <button
              style={{ background: "#333642" }}
              className="p-3  w-1/6 relative rounded-l-md"
            >
              Archive
            </button>
          </div>
        </div>

        <table className=" table-fixed  w-full text-black">
          <thead>
            <tr className="p-2 text-left  ">
              <th className="w-1/6 font-normal">Project Date</th>
              <th className="w-1/3 font-normal">Name</th>
              <th className="w-1/6 font-normal">Created On</th>
              <th className="w-1/4 font-normal">Tags</th>
            </tr>
          </thead>
          <tbody>
            {projectSearched === "" &&
              projects &&
              projects.map((project: ProjectDetails, i) => (
                <Link href={`/projects/${project.id}`} key={i}>
                  <tr className="w-full cursor-pointer bg-white border rounded-md mt-3">
                    <td className="p-3">
                      {project.project_date &&
                        project.project_date.slice(0, 10)}
                    </td>
                    <td className="p-3">{project.title}</td>
                    <td className="p-3">{project.created_at.slice(0, 10)}</td>
                    <td className="p-3">{project.tags}</td>
                  </tr>
                </Link>
              ))}
          </tbody>
          {/* {clientSearched !== "" &&
              searchedClients?.data.map((client: ClientDetails, i: number) => (
                <Link href={`/clients/${client.id}`}>
                  <tr
                    key={i}
                    className="cursor-pointer bg-white border rounded-md mt-3"
                  >
                    <td className="p-3">{client.client_name}</td>
                    <td className="p-3">{client.client_email}</td>
                    <td className="p-3">{client.phone_number}</td>
                  </tr>
                </Link>
              ))} */}
        </table>
      </section>
    </AppLayout>
  );
};

export default Projects;
