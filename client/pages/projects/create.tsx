import axios from "axios";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import ClientSelectInputs from "../../components/app/Clients/ClientSelectInputs";
import ErrorMessage from "../../components/app/ErrorMessage";
import AppLayout from "../../components/app/Layout";
import Loader from "../../components/app/Loader";
import SuccessMessage from "../../components/app/SuccessMessage";
import useFirebaseAuth from "../../hooks/useAuth3";

const Create = () => {
  const { authUser, loading } = useFirebaseAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectDate, setProjectDate] = useState<Date>();
  const [existingClient, setExistingClient] = useState<number>(-1);

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);
  const getTodaysDate = () => {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      time = d.toLocaleTimeString();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-") + `T${time.slice(0, 8)}`;
  };

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

  const addTags = (newTag: string) => {
    setTags([...tags, newTag]);
    setNewTag("");
  };

  const removeTagFromTagList = (toBeRemovedTag: number) => {
    const updatedTags = [...tags];

    updatedTags.splice(toBeRemovedTag, 1);
    return setTags(updatedTags);
  };

  const createProject = async (e: FormEvent) => {
    try {
      if (!authUser?.token) return;
      e.preventDefault();
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.post(
        "/api/projects/create-project",
        {
          title,
          client_name: clientName,
          project_date: projectDate,
          client_email: clientEmail,
          tags,
          clientId: existingClient >= 0 ? existingClient : null,
        },
        config
      );
      if (data?.success) {
        router.push("/projects");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const {
    mutateAsync: handleCreateProject,
    isLoading: loadingCreateProject,
    isSuccess: createProjectSuccess,
    isError: createProjectError,
  } = useMutation(createProject, {
    onSuccess: () => queryClient.invalidateQueries(`projects-${authUser?.uid}`),
  });
  useEffect(() => {
    if (createProjectSuccess) {
      router.push("/projects");
    }
  }, [createProjectSuccess]);

  //todos:
  //1. have a checker for new or existing client association for the project
  //2. add new or existing to body of http call in order for backend to know if its an update or create new user
  console.log("exisitng Client", existingClient);
  return (
    <AppLayout>
      <>
        <h1 className="text-3xl font-semibold">Create a project</h1>
        {loadingCreateProject && <Loader />}

        {createProjectError && <ErrorMessage error="Something went wrong" />}
        {createProjectSuccess && <SuccessMessage success="Project Made" />}
        <form
          className="flex flex-col"
          onSubmit={(e) => handleCreateProject(e)}
        >
          <div className="flex flex-col my-2">
            <label htmlFor="title">Give your project a title</label>
            <input
              type="text"
              id="title"
              className="p-2 rounded-md "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col my-2">
            <label htmlFor="clientName">Choose from your Client List</label>
            <ClientSelectInputs
              newClient={clientName}
              setClient={setExistingClient}
            />
            {/* <input
              type="text"
              className="p-2 rounded-md "
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            /> */}
          </div>
          <hr />
          <div className="flex flex-col my-2">
            <label htmlFor="clientName">Client Full Name</label>
            <input
              type="text"
              className="rounded-md p-2 border outline-none disabled:opacity-700"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              disabled={existingClient > 0 ? true : false}
            />
          </div>
          <div className="flex flex-col my-2">
            <label htmlFor="clientEmail">Client Email</label>
            <input
              type="text"
              id="clientEmail"
              className="rounded-md p-2 border outline-none disabled:opacity-700"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              disabled={existingClient > 0 ? true : false}
            />
          </div>
          <div className="flex flex-col my-2">
            <label htmlFor="projectDate">Project Date</label>

            <input
              type="date"
              className="p-2 rounded-md "
              defaultValue={getTodaysDate()}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                setProjectDate(newDate);
              }}
            />
          </div>
          <div className="flex flex-col my-2">
            <label htmlFor="tags">Tags</label>
            <div className="flex">
              <input
                type="text"
                id="tags"
                className="p-2 rounded-md flex-grow mr-2"
                onChange={(e) => setNewTag(e.target.value)}
                value={newTag}
              />
              <button
                type="button"
                className="bg-blue-500 rounded-md text-white w-1/4"
                onClick={() => addTags(newTag)}
              >
                Add tag
              </button>
            </div>
            <div className="flex flex-wrap">
              {tags &&
                tags.map((tag, i) => (
                  <div
                    className="relative bg-white text-xl rounded-md m-1 p-2"
                    key={i}
                  >
                    {tag}
                    <button
                      type="button"
                      className="absolute text-sm top-0 -right-1"
                      onClick={() => removeTagFromTagList(i)}
                    >
                      x
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-1/3 ml-auto bg-blue-theme text-white p-3 rounded-md mt-3"
            id="projectDate"
          >
            Create
          </button>
        </form>
      </>
    </AppLayout>
  );
};

export default Create;
