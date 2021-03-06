import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ProjectDetails } from "../../types/projectTypes";
import useFirebaseAuth from "../../hooks/useAuth3";
import { TaskDetails } from "../../types/tasksTypes";
import AppLayout from "../../components/app/Layout";
import UserProfileCircle from "../../components/app/User/UserProfileCircle";
import "react-mde/lib/styles/css/react-mde-all.css";
import SendEmailsInProjectPage from "../../components/app/Projects/SendEmailsInProjectPage";
import ProjectDetailsForm from "../../components/app/Projects/projectDetails";
import ProjectTaskInput from "../../components/app/Projects/ProjectTaskInput";
import CheckThreadExists from "../../components/app/Projects/CheckThreadExists";
import Modal from "../../components/app/Modal";
import ClientSelectInputs from "../../components/app/Clients/ClientSelectInputs";
import ClientList from "../../components/app/Clients/ClientList";

const Project = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { projectId } = router.query;
  const { authUser, loading } = useFirebaseAuth();
  const [openModal, setOpenModal] = useState(false);
  const [clientName, setClientName] = useState<string>("");
  const [existingClient, setExistingClient] = useState<number>(-1);
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [isThread, setIsThread] = useState<boolean>(false);

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

  //get the columns from the project table
  const { data: projectDetails, isLoading: pDetailsLoading } =
    useQuery<ProjectDetails>(
      `project-details-${authUser?.uid}-${projectId}`,
      fetchProjectDetails
    );

  //get the tasks associated with the project
  const fetchAssociatedTasks = async () => {
    try {
      if (!authUser?.token || !projectId) return;

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
  //check if there was a thread

  //update-client-project
  const updateClientProject = async () => {
    if (!authUser?.token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    if (existingClient > 0) {
      const { data } = await axios.post(
        `/api/clients/update-client-project/${existingClient}`,
        { associatedProjectId: projectId },
        config
      );
      if (data.success) {
        return setOpenModal(false);
      } else {
        throw new Error("Could not update client project.");
      }
    }
  };
  // add new clients
  const createClient = async () => {
    if (!authUser?.token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    const { data } = await axios.post<{
      data: undefined;
      message: String;
      success: boolean;
    }>(
      "/api/clients/create-client",
      {
        client_name: clientName,
        client_email: email,
        phone_number: phoneNumber,
        notes,
        address,
        city,
        state,
        zip_code: zipCode,
        associatedProjectId: projectId,
      },
      config
    );
    if (data.success) {
      setClientName("");
      setEmail("");
      setPhoneNumber("");
      setAddress("");
      setNotes("");
      return setOpenModal(false);
    }
    window.alert("Something went wrong");
  };
  const {
    mutateAsync: handleAddNewClient,
    isSuccess: isCreateNewClientSuccess,
    isError: isCreateNewClientError,
  } = useMutation(createClient, {
    onSuccess: () =>
      queryClient.invalidateQueries(`users_clients-${authUser?.uid}`),
  });
  const {
    mutateAsync: handleUpdateClientProject,
    isLoading: isUpdateClientProjectLoading,
  } = useMutation(updateClientProject, {
    onSuccess: () =>
      queryClient.invalidateQueries(`users_clients-${authUser?.uid}`),
  });

  return (
    <AppLayout>
      <section className="p-5">
        {projectDetails && (
          <div className="">
            <h2 className="relative text-3xl  font-medium mt-10 mb-8 tracking-wide">
              {projectDetails.title}
            </h2>
            <div className="">
              <p>Visible to you</p>

              <div className="my-3 flex items-center">
                <UserProfileCircle name="ME " />
                {projectId && <ClientList projectId={projectId?.toString()} />}
                <Modal
                  modalName={
                    <div className="flex items-center">
                      <span className="border-dashed border  flex items-center justify-center mr-3 rounded-full border-gray-400 w-8 h-8">
                        +
                      </span>

                      <p className="text-xs">Add participants</p>
                    </div>
                  }
                  // setOpenModal={setOpenModal}
                  // openModal={openModal}
                  contentWidth="w-1/2"
                  contentHeight="h-full"
                >
                  <div className="mt-20 bg-white p-7 rounded-md">
                    <h3 className="text-2xl tracking-wide border-b py-3">
                      Add Client
                    </h3>
                    <div className="">
                      <div className="flex flex-col my-6">
                        <label
                          htmlFor="ExistingClient"
                          className="text-xl mb-3"
                        >
                          Add from existing clients.
                        </label>
                        <ClientSelectInputs
                          id={"ExistingClient"}
                          newClient={clientName}
                          setClient={setExistingClient}
                        />
                      </div>
                      <hr className="my-2" />
                      <div className="flex flex-col mt-6">
                        <p className="text-xl mb-3">Create a new client.</p>
                        <label htmlFor="FirstAndLastName">
                          First and Last Name
                        </label>
                        <input
                          onChange={(e) => setClientName(e.target.value)}
                          value={clientName}
                          name="FirstAndLastName"
                          className="rounded-md p-2 border outline-none disabled:opacity-50"
                          disabled={existingClient > 0 ? true : false}
                        />
                      </div>

                      <div className="flex flex-col my-2">
                        <label htmlFor="email">Email Address</label>
                        <input
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                          name="email"
                          className="rounded-md p-2 border outline-none disabled:opacity-50"
                          disabled={existingClient > 0 ? true : false}
                          type="email"
                        />
                      </div>
                      <div className="flex flex-col my-2">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          value={phoneNumber}
                          name="phoneNumber"
                          className="rounded-md p-2 border outline-none disabled:opacity-50"
                          disabled={existingClient > 0 ? true : false}
                          type="text"
                        />
                      </div>

                      <div className="flex flex-col my-2">
                        <label htmlFor="address">Address</label>
                        <input
                          onChange={(e) => setAddress(e.target.value)}
                          value={address}
                          name="address"
                          className="rounded-md p-2 border outline-none disabled:opacity-50"
                          disabled={existingClient > 0 ? true : false}
                          type="text"
                        />
                      </div>

                      <div className="flex flex-col my-2">
                        <label htmlFor="notes">Notes</label>
                        <textarea
                          name="notes"
                          className="rounded-md p-2 border outline-none disabled:opacity-50"
                          disabled={existingClient > 0 ? true : false}
                          onChange={(e) => setNotes(e.target.value)}
                          value={notes}
                          placeholder="Your clients wont ever see this."
                        ></textarea>
                      </div>

                      <button
                        className="bg-blue-theme text-white px-5 py-2 rounded-md"
                        onClick={() =>
                          existingClient > 0
                            ? handleUpdateClientProject()
                            : handleAddNewClient()
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
            <div className="border-b-2"></div>
            <div className="flex">
              {/* left side */}
              <div className="left-side lg:w-3/4 mr-10">
                {projectId && (
                  <CheckThreadExists
                    projectId={projectId as string}
                    isThread={isThread}
                    setIsThread={setIsThread}
                  />
                )}
                {projectId && !isThread && (
                  <section className="mt-10">
                    <h2 className="relative text-3xl  font-medium mt-10 mb-3 tracking-wide">
                      Start Thread
                    </h2>
                    <SendEmailsInProjectPage
                      projectDetails={projectDetails}
                      projectId={projectId as string}
                      setIsThread={setIsThread}
                    />
                  </section>
                )}
                {/* task section */}
                <section className="pt-10  h-1/2 border-b-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl">Tasks List</h2>
                    {/* <Link href="/tasks/create"> */}
                    <button
                      className="rounded-full w-10 h-10 bg-blue-theme text-white p-2 "
                      onClick={() =>
                        router.push({
                          pathname: "/tasks/create",
                          query: { project_associated: projectId },
                        })
                      }
                    >
                      +
                    </button>
                    {/* </Link> */}
                  </div>
                  <div className="lg:w-full">
                    {tasks &&
                      !tasksLoading &&
                      tasks.map((task, i) => (
                        <ProjectTaskInput
                          task={task}
                          projectId={parseInt(projectId as string)}
                          key={i}
                        />
                      ))}
                  </div>
                </section>
              </div>
              {/* left side ^ */}
              {/* right side of the project */}
              <div className="right-side mt-10 w-1/4">
                {/* <h3>Details</h3> */}
                <ProjectDetailsForm
                  projectDetails={projectDetails}
                  projectId={projectId?.toString()}
                />
              </div>
            </div>
            {/* right side of the project^ */}
          </div>
        )}
      </section>
      {/* task section */}

      {/* <Link href="/projects">
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
      )} */}
    </AppLayout>
  );
};

export default Project;
