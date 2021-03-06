import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import useFirebaseAuth from "../../../hooks/useAuth3";

interface StatusCounter {
  bookedCount: number;
  completedCount: number;
  fulfillmentCount: number;
  leadCount: number;
}
const ProjectStatusCharts = () => {
  const { authUser } = useFirebaseAuth();
  const getProjectStatusCounts = async () => {
    try {
      if (!authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.get(
        "/api/projects/list-projects-status-counter",
        config
      );
      if (data.success) {
        return data.data.statusCounts;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const { data: statusCounters, isLoading: loadingProjects } =
    useQuery<StatusCounter>(
      `projects-status-${authUser?.uid}`,
      getProjectStatusCounts
    );
  // console.log("statusCounters", statusCounters);
  return (
    <div className="">
      <h2 className="tracking-wide text-2xl mb-5 font-medium">Stats</h2>
      <section
        className="w-full md:grid md:grid-cols-2 md:gap-4 p-3 rounded-md"
        style={{ background: "#f0f0f0" }}
      >
        <div
          className="mt-2  px-5 py-3 flex rounded-md shadow-xl items-start justify-between"
          style={{ background: "#ffffff" }}
        >
          <div className="flex flex-col">
            <h4 className="text-xl">Leads</h4>
            <p className="text-xl font-bold">{statusCounters?.leadCount}</p>
          </div>
          <img src={"/Closed.png"} className="w-24 object-cover" />
        </div>

        <div
          className="mt-2 px-5 py-3 flex rounded-md shadow-xl items-start justify-between"
          style={{ background: "#ffffff" }}
        >
          <div className="flex flex-col">
            <h4 className="text-xl">Booked</h4>
            <p className="text-xl font-bold">{statusCounters?.bookedCount}</p>
          </div>
          <img src={"/Inprogress.png"} className="w-24 object-cover" />
        </div>

        <div
          className="mt-2  px-5 py-3 flex rounded-md shadow-xl items-start justify-between"
          style={{ background: "#ffffff" }}
        >
          <div className="flex flex-col">
            <h4 className="text-xl">Fulfillment</h4>
            <p className="text-xl font-bold">
              {statusCounters?.fulfillmentCount}
            </p>
          </div>
          <img src={"/Pending.png"} className="w-24 object-cover" />
        </div>
        <div
          className="mt-2  px-5 py-3 flex rounded-md shadow-xl items-start justify-between"
          style={{ background: "#ffffff" }}
        >
          <div className="flex flex-col">
            <h4 className="text-xl">Completed</h4>
            <p className="text-xl font-bold">
              {statusCounters?.completedCount}
            </p>
          </div>
          <img
            src={"/CompletedProjectLabel.png"}
            className="w-24 object-cover"
          />
        </div>
      </section>
    </div>
  );
};

export default ProjectStatusCharts;
