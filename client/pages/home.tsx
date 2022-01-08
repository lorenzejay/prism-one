import React, { useEffect } from "react";
import { useRouter } from "next/router";
import AppLayout from "../components/app/Layout";
import ProjectsTable from "../components/app/Home/ProjectsTable";
import TaskTable from "../components/app/Home/TaskTable";
import ProjectStatusCharts from "../components/app/Home/ProjectStatusCharts";
import useFirebaseAuth from "../hooks/useAuth3";
import LeadStats from "../components/app/Home/LeadStats";
const Home = () => {
  const router = useRouter();
  const { authUser, loading } = useFirebaseAuth();
  useEffect(() => {
    if (!loading && authUser === null) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

  return (
    <AppLayout>
      <div className="smooth overflow-hidden">
        {/* <h2 className="font-bold text-2xl ">Dashboard</h2> */}

        <section className="flex flex-col md:flex-row md:justify-between w-full">
          <div className="flex flex-col w-full md:w-3/5 flex-wrap md:mr-2 2xl:mr-10">
            <h2 className="tracking-wide text-xl font-semibold">Job List</h2>
            <ProjectsTable />
            <ProjectStatusCharts />
          </div>
          <div className="md:w-2/5 flex flex-col ">
            <TaskTable />
            <LeadStats />
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Home;
