import axios from "axios";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import useFirebaseAuth from "../../../hooks/useAuth3";
interface SelectAssociatedProjectProps {
  createMode: boolean;
  defaultProject?: number | undefined;
  defaultProjects?: { title: string; id: number }[];
  projectAssociated: number | undefined;
  setProjectAssociated: (x: number) => void;
}
const SelectAssociatedProject = ({
  createMode,
  defaultProject,
  defaultProjects,
  projectAssociated,
  setProjectAssociated,
}: SelectAssociatedProjectProps) => {
  const { authUser } = useFirebaseAuth();
  //list out projects to select from associated -> map that on select

  const getProjectToAssociateTaskTo = async () => {
    if (!authUser?.token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    const { data } = await axios.get(
      "/api/tasks/list-associated-projects",
      config
    );
    return data.data;
  };
  const { data: projects } = useQuery<{ title: string; id: number }[]>(
    `project-association-${authUser?.uid}`,
    getProjectToAssociateTaskTo
  );
  useEffect(() => {
    if (defaultProject) {
      setProjectAssociated(defaultProject);
    }
  }, [defaultProject]);

  return (
    <>
      <label htmlFor="ProjectAssociated" className="text-lg">
        Project Associated:
      </label>
      <select
        name="ProjectAssociated"
        disabled={defaultProject ? true : false}
        className="rounded-md p-2 mb-4"
        // defaultValue={defaultProject || ""}
        onChange={(e) => {
          setProjectAssociated(parseInt(e.target.value));
        }}
        defaultValue={defaultProject}
      >
        {/* <option defaultValue={defaultProject}></option> */}
        {projects &&
          createMode &&
          projects.map((sub, i) => (
            <option value={sub.id} key={i}>
              {sub.title}
            </option>
          ))}
        {!createMode &&
          defaultProjects &&
          defaultProjects.map((sub, i) => (
            <option value={sub.id} key={i}>
              {sub.title}
            </option>
          ))}
      </select>
    </>
  );
};

export default SelectAssociatedProject;
