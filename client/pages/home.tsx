import React, { useEffect } from "react";
import { useRouter } from "next/router";
import AppLayout from "../components/app/Layout";
import ProjectsTable from "../components/app/Home/ProjectsTable";
import TaskTable from "../components/app/Home/TaskTable";
import ProjectStatusCharts from "../components/app/Home/ProjectStatusCharts";
import useFirebaseAuth from "../hooks/useAuth3";
import {
  LineChart,
  XAxis,
  Tooltip,
  CartesianGrid,
  Line,
  Area,
  AreaChart,
} from "recharts";
const Home = () => {
  const router = useRouter();
  const { authUser, loading } = useFirebaseAuth();
  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);
  const data = [
    {
      name: "Jan",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Feb",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "March",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "April",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "May",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "June",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "July",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
    {
      name: "August",
      uv: 3490,
      pv: 4300,
      amt: 0,
    },
  ];
  return (
    <AppLayout>
      <div className="smooth ">
        {/* <h2 className="font-bold text-2xl ">Dashboard</h2> */}

        <section className="flex justify-between w-full">
          <div className="flex flex-col w-3/5 flex-wrap md:mr-2 2xl:mr-10">
            <h2 className="tracking-wide text-xl font-semibold">Job List</h2>
            <ProjectsTable />
            <ProjectStatusCharts />
          </div>
          <div className="w-2/5 flex flex-col ">
            <TaskTable />
            <h2 className="tracking-wide text-xl font-semibold mb-3">
              Revenue
            </h2>
            <div style={{ background: "#f0f0f0" }} className="rounded-md p-2">
              <AreaChart
                width={400}
                height={400}
                data={data}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                {/* <Line
                type="monotone"
                fill="#ff7300"
                dataKey="uv"
                stroke="#ff7300"
                yAxisId={0}
              />
              <Line
                type="monotone"
                fill="#387908"
                dataKey="pv"
                
                stroke="#387908"
                yAxisId={1}
              /> */}
                <Area
                  type="monotone"
                  dataKey="amt"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
              </AreaChart>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Home;
