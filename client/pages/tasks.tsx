import React, { useEffect, useState } from "react";
import AppLayout from "../components/app/Layout";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "react-query";
import { FormType, TaskDetails } from "../types/tasksTypes";
import { useRouter } from "next/router";
const Tasks = () => {
  const router = useRouter();
  const { userToken, userId } = useAuth();
  const [clientSearched, setClientSearched] = useState("");

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
    }
  }, [userId]);

  const listTasks = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userToken,
      },
    };
    const { data } = await axios.get("/api/tasks/list-tasks", config);
    if (data.success) {
      return data.data;
    }
  };
  const { data: tasks } = useQuery<TaskDetails[]>("tasks", listTasks);
  console.log("tasks", tasks);
  return (
    <AppLayout>
      <div className="flex flex-col">
        <section className="my-7 flex items-center justify-start font-light">
          <h2 className="flex-grow text-3xl font-medium">Tasks</h2>
          <div className="mr-3 flex items-center justify-start  ">
            <input
              placeholder="Seach your tasks"
              className="bg-white p-2 flex m-0 shadow-2xl"
              onChange={(e) => setClientSearched(e.target.value)}
              value={clientSearched}
            />
            <button className="  z-10 bg-yellow-600 rounded-md p-2">Q</button>
          </div>
          <Link href="/clients/create">
            <button
              className="p-2 rounded-md text-white"
              style={{ background: "#1D4757" }}
            >
              New Tasks <span className="rounded-full">+</span>
            </button>
          </Link>
        </section>
        <table>
          <tr className="p-2 text-left  ">
            <th className="w-1/6 font-normal"></th>
            <th className="w-1/2 font-normal">Task</th>
            <th className="w-1/5 font-normal">Due Date</th>
            <th className="w-1/5 font-normal">Project</th>
            <th className="w-1/6 font-normal"></th>
          </tr>
          {tasks &&
            tasks.map((task) => (
              <tr key={task.id} className="bg-white rounded-md ">
                <td className="p-3 rounded-tl-md rounded-bl-md">
                  <input
                    type="checkbox"
                    checked={task.status === FormType.completed ? true : false}
                  />
                </td>
                <td className="p-3 ">
                  <p
                    className={`${
                      task.status === FormType.completed ? "line-through" : ""
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
            ))}
        </table>
      </div>
    </AppLayout>
  );
};

export default Tasks;
