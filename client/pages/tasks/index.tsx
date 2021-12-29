import React, { useEffect, useState } from "react";
import AppLayout from "../../components/app/Layout";
import Link from "next/link";
import axios from "axios";
import { useQuery } from "react-query";
import { FormType, TaskDetails } from "../../types/tasksTypes";
import { useRouter } from "next/router";
import useFirebaseAuth from "../../hooks/useAuth3";
import Loader from "../../components/app/Loader";
const Tasks = () => {
  const router = useRouter();
  const { loading, authUser } = useFirebaseAuth();
  const [taskSearched, setTaskSearched] = useState("");

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

  const listTasks = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser?.token !== null && authUser?.token,
      },
    };
    const { data } = await axios.get("/api/tasks/list-tasks", config);
    if (data.success) {
      return data.data;
    }
  };
  const handleSearchTask = async () => {
    try {
      if (taskSearched === "") return null;
      if (!authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser?.token !== null && authUser.token,
        },
      };
      if (taskSearched !== null || taskSearched !== "") {
        const { data } = await axios.get(
          `/api/tasks/task-filter-by-name/${taskSearched}`,
          config
        );
        if (data.success) {
          return data.data;
        }
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const { data: tasks, isLoading: loadingTasks } = useQuery<TaskDetails[]>(
    `tasks-${authUser?.uid}`,
    listTasks
  );
  const {
    data: searchedTasks,
    isLoading: loadingSearchedTask,
    error: searchingError,
  } = useQuery<TaskDetails[] | null>(
    `searched-users_tasks-${authUser?.uid}-${taskSearched}`,
    handleSearchTask
  );
  return (
    <AppLayout>
      <div className="flex flex-col">
        <section className="my-7 flex items-center justify-start font-light">
          <h2 className="flex-grow text-3xl font-medium">Tasks</h2>
          <div className="mr-3 flex items-center justify-start  ">
            <input
              placeholder="Seach your tasks"
              className="bg-white p-2 flex m-0 shadow-2xl"
              onChange={(e) => setTaskSearched(e.target.value)}
              value={taskSearched}
            />
            <button className="  z-10 bg-yellow-600 rounded-md p-2">Q</button>
          </div>
          <Link href="/tasks/create">
            <button
              className="p-2 rounded-md text-white"
              style={{ background: "#1D4757" }}
            >
              New Tasks <span className="rounded-full">+</span>
            </button>
          </Link>
        </section>
        {loadingTasks && <Loader />}
        {/* {loadingSearchedTask && <Loader />} */}
        {!loadingSearchedTask && !loadingTasks && (
          <table>
            <tr className="p-2 text-left  ">
              <th className="w-1/6 font-normal"></th>
              <th className="w-1/2 font-normal">Task</th>
              <th className="w-1/5 font-normal">Due Date</th>
              <th className="w-1/5 font-normal">Project</th>
              <th className="w-1/6 font-normal"></th>
            </tr>
            {tasks &&
              taskSearched === "" &&
              tasks.map((task, i) => (
                <Link href={`/tasks/${task.id}`} key={i}>
                  <tr
                    className={`bg-white relative rounded-md cursor-pointer  ${
                      task.status === FormType.completed ? " opacity-50  " : ""
                    }`}
                  >
                    <td
                      className={`p-3 rounded-tl-md rounded-bl-md  ${
                        task.status === FormType.completed
                          ? " opacity-50 task-line-through "
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={
                          task.status === FormType.completed ? true : false
                        }
                      />
                    </td>
                    <td className="p-3 ">
                      <p className={` `}>{task.description}</p>
                    </td>
                    <td className="p-3">{task.due_date}</td>
                    <td className="p-3 rounded-tr-md rounded-br-md">
                      {task.project_associated}
                    </td>
                  </tr>
                </Link>
              ))}
            {searchedTasks &&
              taskSearched !== "" &&
              searchedTasks.map((task, i) => (
                <Link href={`/tasks/${task.id}`} key={i}>
                  <tr className="bg-white rounded-md cursor-pointer">
                    <td className="p-3 rounded-tl-md rounded-bl-md">
                      <input
                        type="checkbox"
                        checked={
                          task.status === FormType.completed ? true : false
                        }
                      />
                    </td>
                    <td className="p-3 ">
                      <p
                        className={`${
                          task.status === FormType.completed
                            ? "line-through"
                            : ""
                        } `}
                      >
                        {task.description}
                      </p>
                    </td>
                    <td className="p-3">{task.due_date}</td>
                    <td className="p-3 rounded-tr-md rounded-br-md">
                      {task.project_associated}
                    </td>
                  </tr>
                </Link>
              ))}
          </table>
        )}
      </div>
    </AppLayout>
  );
};

export default Tasks;
