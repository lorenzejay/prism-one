import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import AppLayout from "../../components/app/Layout";
import useFirebaseAuth from "../../hooks/useAuth3";
import { LeadFormType } from "../../types/leadsTypes";

const Index = () => {
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();
  // console.log("routerpath", router.asPath.slice(1, router.asPath.length));
  useEffect(() => {
    if (!loading && authUser === null) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);
  useEffect(() => {
    window.localStorage.setItem(
      "currentDash",
      router.asPath.slice(1, router.asPath.length)
    );
  }, [router]);
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
        <div className="flex mb-5">
          <h2 className="flex-grow text-3xl font-medium ">Leads</h2>

          <button
            className="p-2 rounded-md text-white"
            style={{ background: "#1D4757" }}
          >
            <Link href="/leads/create">New Lead</Link>
          </button>
        </div>
        <table className="w-full border border-collapse p-3">
          <thead>
            <tr>
              <td className="border p-3 bg-white">Name</td>
              <td className="border p-3 bg-white">Created By</td>
            </tr>
          </thead>
          <tbody>
            {leads &&
              leads.map((lead, i) => (
                <Link href={`/leads/${lead.id}`} key={i}>
                  <tr className="w-full bg-white cursor-pointer">
                    <td className="border p-3 ">
                      <p>{lead.title}</p>
                    </td>
                    <td className="border p-3 ">
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
