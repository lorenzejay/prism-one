import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import AppLayout from "../components/app/Layout";
import ProjectsTable from "../components/app/Home/ProjectsTable";
import TaskTable from "../components/app/Home/TaskTable";
import ProjectStatusCharts from "../components/app/Home/ProjectStatusCharts";

const Home = () => {
  const router = useRouter();
  const { userId } = useAuth();
  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
    }
  }, [userId]);

  return (
    <AppLayout>
      <div className="smooth ">
        <h2 className="font-bold text-2xl ">Dashboard</h2>

        <section className="flex justify-between w-full">
          <div className="flex flex-col w-3/5 flex-wrap md:mr-2 2xl:mr-10">
            <h2>Job List</h2>
            <ProjectsTable />
            <ProjectStatusCharts />
          </div>

          <TaskTable />
        </section>
      </div>
    </AppLayout>
  );
};

export default Home;
