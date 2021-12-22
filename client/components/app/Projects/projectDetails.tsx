import axios from "axios";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../../hooks/useAuth";
import { ProjectDetails, ProjectStatus } from "../../../types/projectTypes";
import { TaskDetails } from "../../../types/tasksTypes";
import { ApiCallReturn } from "../../../types/userTypes";

interface ProjectFormTypes {
  projectDetails?: ProjectDetails | null;
  projectId?: string;
}
const ProjectDetailsForm = ({
  projectDetails,
  projectId,
}: ProjectFormTypes) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userId, userToken } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [privateProject, setIsProjectPrivate] = useState<boolean>();
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState<number>();
  const [projectDate, setProjectDate] = useState<string>();
  const [amountDue, setAmountDue] = useState<number>();
  const [goals, setGoals] = useState<string[]>();
  const [tasks, setTasks] = useState<TaskDetails[]>();
  const [tags, setTags] = useState<string[]>();
  const [jobType, setJobType] = useState<string>("");
  const [expectedRevenue, setExpectedRevenue] = useState<number>();
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>();
  // phase 2
  // const [gallery, setGallery] = useState<number>();
  // add headerimg and gallery
  useEffect(() => {
    if (projectDetails) {
      setClientName(projectDetails.client_name);
      setClientEmail(projectDetails.client_email);

      setTitle(projectDetails.title);
      setIsProjectPrivate(projectDetails.is_private);
      setExpectedRevenue(projectDetails.expected_revenue);
      setAmountPaid(projectDetails.amount_paid);
      setGoals(projectDetails.goals);
      setJobType(projectDetails.job_type);
      setAmountDue(projectDetails.amount_due);
      setJobType(projectDetails.job_type);
    }
  }, [projectDetails]);

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
    }
  }, [userId]);

  const updateProjectDetails = async (e: FormEvent) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userToken,
      },
    };
    await axios.post(
      `/api/clients/update-project-details/${projectId}`,
      {
        clientName,
        clientEmail,
        title,
        privateProject,
        projectDate,
        jobType,
        amountPaid,
        amountDue,
        expectedRevenue,
        projectStatus,
        tags,
        tasks,
        goals,
      },
      config
    );
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
      token: userToken,
    },
  };
  const deleteProject = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact?"
    );
    if (!confirmDelete) return;
    if (!projectId || !userToken) return;

    const { data } = await axios.delete<ApiCallReturn>(
      `/api/clients/delete-project/${projectId}`,
      config
    );
    if (data.success) {
      router.push("/clients");
    }
  };
  const { mutateAsync: handleUpdateProject, isLoading } = useMutation(
    updateProjectDetails,
    {
      onSuccess: () => queryClient.invalidateQueries(`users_clients-${userId}`),
    }
  );
  const { mutateAsync: handleDeleteProject } = useMutation(deleteProject, {
    onSuccess: () => queryClient.invalidateQueries(`projects-${userId}`),
  });
  console.log(projectDate);
  return (
    <form
      className="w-full px-5 py-3 lg:w-1/2 mx-auto font-light flex flex-col text-black bg-white "
      onSubmit={handleUpdateProject}
    >
      {isLoading && <div className="loader mx-auto"></div>}
      <h3 className="text-3xl font-semibold my-3">Contacts</h3>
      <div className="flex flex-col my-2">
        <label htmlFor="FirstAndLastName">First and Last Name</label>
        <input
          onChange={(e) => setClientName(e.target.value)}
          value={clientName}
          name="FirstAndLastName"
          className="rounded-md p-2 border outline-none"
        />
      </div>
      <div className="flex flex-col my-2">
        <label htmlFor="email">Email Address</label>
        <input
          onChange={(e) => setClientEmail(e.target.value)}
          value={clientEmail}
          name="email"
          className="rounded-md p-2 border outline-none"
          type="text"
        />
      </div>
      <div className="flex flex-col my-2">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          onChange={(e) => setClientName(e.target.value)}
          value={clientName}
          name="phoneNumber"
          className="rounded-md p-2 border outline-none"
          type="text"
        />
      </div>

      <div className="flex flex-col my-2">
        <label htmlFor="address">Amount Due</label>
        <input
          onChange={(e) => setAmountDue(parseInt(e.target.value))}
          value={amountDue}
          name="address"
          className="rounded-md p-2 border outline-none"
          type="text"
        />
      </div>
      <div className="flex flex-col my-2">
        <label htmlFor="city">Expected Revenue</label>
        <input
          onChange={(e) => setExpectedRevenue(parseInt(e.target.value))}
          value={expectedRevenue}
          name="city"
          className="rounded-md p-2 border outline-none"
          type="text"
        />
      </div>
      <div className="flex flex-col my-2">
        <label htmlFor="state">Job Type</label>
        <input
          onChange={(e) => setJobType(e.target.value)}
          value={jobType}
          name="state"
          className="rounded-md p-2 border outline-none"
          type="text"
        />
      </div>
      <div className="flex flex-col my-2">
        <label htmlFor="state">Project Status</label>
        <select
          onChange={(e) => setProjectStatus(e.target.value as ProjectStatus)}
          value={projectStatus}
          name="state"
          className="rounded-md p-2 border outline-none"
        >
          <option value={ProjectStatus.Inquiry}>{ProjectStatus.Inquiry}</option>
          <option value={ProjectStatus.Proposal}>
            {ProjectStatus.Proposal}
          </option>
          <option value={ProjectStatus.Proposal_Status}>
            {ProjectStatus.Proposal_Status}
          </option>
          <option value={ProjectStatus.Deposit}>{ProjectStatus.Deposit}</option>
          <option value={ProjectStatus.Completed}>
            {ProjectStatus.Completed}
          </option>
        </select>
      </div>
      <div className="flex flex-col my-2">
        <label htmlFor="state">Date</label>
        <input
          onChange={(e) => setProjectDate(e.target.value)}
          value={projectDate}
          name="state"
          className="rounded-md p-2 border outline-none"
          type="text"
        />
      </div>
      <div className="flex flex-col my-2">
        <label htmlFor="notes">Privacy</label>
        <select
          name="notes"
          className="p-2 rounded-md my-2 border outline-none"
          defaultValue={privateProject ? "private" : "public"}
          onChange={(e) => {
            if (e.target.value === "private") {
              setIsProjectPrivate(false);
            } else {
              setIsProjectPrivate(true);
            }
          }}
          // value={privateProject}
        >
          <option value={"private"}>Private</option>
          <option value={"public"}>Public</option>
        </select>

        <button
          type="button"
          onClick={() => handleDeleteProject()}
          className="text-red-600 mr-auto rounded-md transition duration-500 ease-in-out hover:text-red-900"
        >
          Delete Project
        </button>
      </div>

      <button
        className="ml-auto hover:bg-yellow-400 transition-all duration-300  lg:w-1/4 rounded-md text-white p-2 my-2"
        style={{ background: "#F88946" }}
        type={"submit"}
      >
        Save
      </button>
    </form>
  );
};

export default ProjectDetailsForm;