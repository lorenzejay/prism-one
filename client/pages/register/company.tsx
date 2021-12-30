import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AppLayout from "../../components/app/Layout";
import Layout from "../../components/LandingPageComponents/Layout";
import useFirebaseAuth from "../../hooks/useAuth3";
import { Industry } from "../../types/userTypes";

const Company = () => {
  const router = useRouter();
  const { authUser, loading } = useFirebaseAuth();
  const [industry, setIndustry] = useState<Industry>(
    Industry.Wedding_Videography
  );
  const [company_name, setCompanyName] = useState("");
  const [company_email, setCompanyEmail] = useState("");

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

  const handleFinishCreatingProfile = async (e: React.FormEvent) => {
    try {
      if (!authUser?.token) return;
      e.preventDefault();
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.post<{ success: boolean; message: string }>(
        "/api/users/register-company",
        { industry, company_name, company_email },
        config
      );
      if (data.success) {
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="flex w-full flex-col items-center  min-h-full pt-24"
        style={{ background: "#F9F9F9" }}
      >
        <h3 className="font-bold text-3xl ">Let&apos;s get you started</h3>
        <form
          className="flex flex-col w-1/2 rounded-md shadow-2xl border mt-10 p-10"
          onSubmit={handleFinishCreatingProfile}
        >
          <h2 className="font-semibold text-xl">Tell us about your company</h2>
          <section className="flex flex-col my-3">
            <label htmlFor="companyName text-lg">Company Name</label>
            <input
              onChange={(e) => setCompanyName(e.target.value)}
              value={company_name}
              className="companyName border rounded-sm  p-2 focus:outline-none focus:border-blue-500"
            />
          </section>
          <section className="flex flex-col my-3">
            <label htmlFor="companyName text-lg">Company Email Address</label>
            <input
              onChange={(e) => setCompanyEmail(e.target.value)}
              value={company_email}
              className="companyName border rounded-sm  p-2 focus:outline-none focus:border-blue-500"
            />
          </section>

          <section className="flex flex-col my-3">
            <label htmlFor="companyName text-lg">Industry</label>
            <select
              className="border rounded-sm  p-2 focus:outline-none focus:border-blue-500"
              onChange={(e) => setIndustry(e.target.value as Industry)}
              defaultValue={Industry.Wedding_Videography}
            >
              <option value={Industry.Wedding_Videography}>
                Wedding Videography
              </option>
              <option value={Industry.Wedding_Photography}>
                Wedding Photography
              </option>
              <option value={Industry.Portrait_Photography}>
                Portrait Photography
              </option>
              <option value={Industry.Commerical_Photography}>
                Commerical Photography
              </option>
              <option value={Industry.Commerical_Video}>
                Commerical Video
              </option>
              <option value={Industry.Digital_Artist}>Digital Artist</option>
              <option value={Industry.Other}>Other</option>
            </select>
          </section>
          <button
            className="ml-auto p-3 bg-blue-500 rounded-md text-white"
            style={{ background: "#1D4757" }}
          >
            Finish
          </button>
        </form>
      </div>
    </>
  );
};

export default Company;
