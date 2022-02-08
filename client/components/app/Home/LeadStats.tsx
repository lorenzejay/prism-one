import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useFirebaseAuth from "../../../hooks/useAuth3";
import Loader from "../Loader";

const LeadStats = () => {
  const { authUser } = useFirebaseAuth();
  const getLeadStats = async () => {
    try {
      if (!authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.get("/api/leads/list-lead-amounts", config);
      if (data.success) {
        return data.data;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const { data: leadStats, isLoading } = useQuery(
    `lead-stats-${authUser?.uid}`,
    getLeadStats
  );
  return (
    <section>
      <h2 className="tracking-wide text-2xl mb-5 font-medium">Leads</h2>
      {isLoading && <Loader />}
      {leadStats && !isLoading && (
        <div
          style={{ background: "#f0f0f0" }}
          className="w-full overflow-x-auto rounded-md p-2"
        >
          <AreaChart
            className="w-full overflow-x-auto"
            width={375}
            height={400}
            data={leadStats}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            {/* <XAxis dataKey="name" /> */}
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />

            <Area
              type="monotone"
              dataKey="count"
              stroke="#1D4757"
              fill="#1D4757"
            />
          </AreaChart>
        </div>
      )}
    </section>
  );
};

export default LeadStats;
