import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import ErrorMessage from "../../../components/app/ErrorMessage";
import LeadForm from "../../../components/app/Leads/Form";
import Loader from "../../../components/app/Loader";
import useFirebaseAuth from "../../../hooks/useAuth3";
import { LeadFormMode, LeadFormType } from "../../../types/leadsTypes";

const InvLead = () => {
  const router = useRouter();
  const { leadId } = router.query;
  const { authUser } = useFirebaseAuth();

  const fetchLead = async () => {
    try {
      if (!leadId || !authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.get(
        `/api/leads/list-lead/${leadId}`,
        config
      );
      if (data.success) {
        return data.data;
      }
    } catch (error) {
      throw new Error("Something went wrong");
    }
  };
  const {
    data: leadDetails,
    isLoading,
    isError,
    error,
  } = useQuery<LeadFormType>(`leadform-${leadId}-${authUser?.uid}`, fetchLead);
  // console.log("leadDetails", leadDetails);

  return (
    <>
      {isLoading && <Loader />}
      {isError && <ErrorMessage error="Something went wrong" />}
      {leadDetails && !isLoading && (
        <LeadForm
          formElements={leadDetails.formElements}
          mode={LeadFormMode.CLIENT}
          leadId={parseInt(leadId as string)}
          formOwner={leadDetails.created_by}
        />
      )}
    </>
  );
};

export default InvLead;
