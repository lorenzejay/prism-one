import axios from "axios";
import { useRouter } from "next/router";
import React, { FormEvent, FormEventHandler, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import AppLayout from "../../components/app/Layout";
import { useAuth } from "../../hooks/useAuth";

const Create = () => {
  const { userId, userToken } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectDate, setProjectDate] = useState<Date>();

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const getTodaysDate = () => {
    const date = new Date();
    console.log("date", date);
    return date.toDateString();
    let day: any = date.getDate();
    let month: any = date.getMonth() + 1;
    const year = date.getFullYear();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    let today = year + "-" + month + "-" + day;
    return today;
  };

  useEffect(() => {
    if (!userId) router.push("/sign-in");
  }, [userId]);

  const addTags = (newTag: string) => {
    setTags([...tags, newTag]);
    setNewTag("");
  };

  const removetagFromTagList = (toBeRemovedTag: number) => {
    const updatedTags = [...tags];
    console.log(toBeRemovedTag);
    updatedTags.splice(toBeRemovedTag, 1);
    return setTags(updatedTags);
  };

  const createProject = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: userToken,
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
  const { mutateAsync: handleCreateProject } = useMutation(createProject, {
    onSuccess: () => queryClient.invalidateQueries(`users_clients-${userId}`),
  });

  return (
    <AppLayout>
      <>
        <h1 className="text-3xl font-semibold">Create a project</h1>
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
            <label htmlFor="clientName">Client Full Name</label>
            <input
              type="text"
              className="p-2 rounded-md "
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div className="flex flex-col my-2">
            <label htmlFor="clientEmail">Client Email</label>
            <input
              type="text"
              id="clientEmail"
              className="p-2 rounded-md "
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col my-2">
            <label htmlFor="projectDate">Project Date</label>

            <input
              type="datetime-local"
              className="p-2 rounded-md "
              defaultValue={getTodaysDate()}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                console.log(newDate);
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
                      onClick={() => removetagFromTagList(i)}
                    >
                      x
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-1/3 ml-auto bg-green-600 p-3 rounded-md mt-3"
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