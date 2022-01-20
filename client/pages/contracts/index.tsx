import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import AppLayout from "../../components/app/Layout";
import useFirebaseAuth from "../../hooks/useAuth3";
import Link from "next/link";
import { ContractTypes } from "../../types/contract";

const Index = () => {
  const { authUser } = useFirebaseAuth();
  const fetchContracts = async () => {
    try {
      if (!authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser?.token,
        },
      };
      const { data } = await axios.get("/api/contracts/list-contracts", config);
      if (data.success) {
        return data.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const { data: contractList } = useQuery<ContractTypes[]>(
    `contracts-${authUser?.uid}`,
    fetchContracts
  );

  //list out the fetched contracts

  // console.log("contractList", contractList);
  return (
    <AppLayout>
      <section className={`relative px-10 py-5 min-h-full bg-gray-theme`}>
        <h3 className="text-3xl mb-5 tracking-wide ">Contracts</h3>
        <table className="w-full border border-collapse p-3 ">
          <thead>
            <tr className="p-2 text-left  ">
              <th className="w-1/6 font-normal border bg-white p-3">Name</th>
              <th className="w-1/6 font-normal border bg-white p-3">
                Date Created
              </th>
            </tr>
          </thead>
          <tbody>
            {contractList &&
              contractList.map((contract, i) => (
                <Link href={`/contracts/${contract.id}`} key={i}>
                  <tr className="w-full cursor-pointer bg-white border rounded-md mt-3">
                    <td className="p-3 border">{contract.contract_name}</td>
                    <td className="p-3 border">
                      {contract.created_at.slice(0, 10)}
                    </td>
                  </tr>
                </Link>
              ))}
          </tbody>
        </table>
      </section>
    </AppLayout>
  );
};

export default Index;
