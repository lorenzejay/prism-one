import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import useFirebaseAuth from "../../../hooks/useAuth3";
import ErrorMessage from "../ErrorMessage";
import Loader from "../Loader";

interface LeadDataProps {
  leadId: number;
}
const LeadData = ({ leadId }: LeadDataProps) => {
  const { authUser } = useFirebaseAuth();
  const fetchLeadForm = async () => {
    try {
      if (!leadId || !authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.get(
        `/api/leads/list-lead-data/${leadId}`,
        config
      );
      if (data.success) {
        return data.data;
      } else {
        throw Error(data.message);
      }
    } catch (error) {
      throw new Error("Something went wrong");
    }
  };
  const {
    data: leadData,
    isLoading,
    isError,
    error,
  } = useQuery<
    {
      id: number;
      created_at: string;
      lead_associated: number;
      response: { key: string; value: string }[];
    }[]
  >(`leadData-${leadId}-${authUser?.uid}`, fetchLeadForm);
  //   console.log("leadData", leadData);
  return (
    <div>
      {isLoading && <Loader />}
      {isError && <ErrorMessage error="No Leads" />}
      {leadData && (
        <table className="w-full overflow-x-auto border border-collapse h-auto ">
          <thead>
            <tr className="text-left ">
              {leadData[0].response.map((res, i) => (
                <th key={i} className="border p-2 rounded-l-md">
                  {res.key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="">
            {leadData.map((lead, i) => (
              <tr className="text-left" aria-rowspan={4} key={i}>
                {lead.response.map((res, i) => (
                  <td className="border p-2 rounded-l-md" key={i}>
                    {res.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeadData;
