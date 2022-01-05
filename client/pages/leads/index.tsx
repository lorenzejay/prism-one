import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import AppLayout from "../../components/app/Layout";
import useFirebaseAuth from "../../hooks/useAuth3";
import { InputData, LeadFormType } from "../../types/leadsTypes";

const Index = () => {
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);
  const getLeads = async () => {
    if (!authUser?.token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    const { data } = await axios.get("/api/leads/list-lead-forms", config);
    if (data.success) {
      return data.data;
    }
  };

  const {
    data: leads,
    isLoading,
    error,
  } = useQuery<LeadFormType[]>(`leads-${authUser?.uid}`, getLeads);
  return (
    <AppLayout>
      <>
        <h2 className="flex-grow text-3xl font-medium ">Leads</h2>
        <table className="w-1/2">
          <thead>
            <tr>
              <td>Name</td>
              <td>Created By</td>
            </tr>
          </thead>
          <tbody>
            {leads &&
              leads.map((lead, i) => (
                <Link href={`/leads/${lead.id}`} key={i}>
                  <tr className="w-full bg-white cursor-pointer">
                    <td className="p-3 rounded-l-md">
                      <p>{lead.title}</p>
                    </td>
                    <td className="p-3 rounded-r-md">
                      <p>{lead.created_at.slice(0, 10)}</p>
                    </td>
                  </tr>
                </Link>
              ))}
          </tbody>
        </table>
      </>
    </AppLayout>
  );
};

export default Index;
