import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import ErrorMessage from "../../components/app/ErrorMessage";
import AppLayout from "../../components/app/Layout";
import LeadForm from "../../components/app/Leads/Form";
import LeadInputField from "../../components/app/Leads/LeadInputField";
import useFirebaseAuth from "../../hooks/useAuth3";
import {
  CreateMode,
  InputData,
  InputType,
  LeadFormMode,
} from "../../types/leadsTypes";
enum DisplayMode {
  Create = "Create",
  Preview = "Preview",
  EmbededCode = "EmbededCode",
}

const Create = () => {
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [uploadError, setUploadError] = useState("");
  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);
  const [formElements, setFormElements] = useState<InputData[]>([
    {
      name: "Full Name",
      inputType: InputType.TEXT,
      required: true,
      value: "",
    },
    {
      name: "Email",
      inputType: InputType.EMAIL,
      required: true,
      value: "",
    },
    {
      name: "Phone Number",
      inputType: InputType.TEXT,
      required: true,
      value: "",
    },
  ]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    DisplayMode.Create
  );

  const [leadTitle, setLeadTitle] = useState("");
  const createLeadForm = async (e: any) => {
    try {
      e.preventDefault();
      if (leadTitle === "") {
        return setUploadError("You must include a title for your lead form.");
      }
      if (!authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.post(
        "/api/leads/create-lead-form",
        { title: leadTitle, formElements: JSON.stringify(formElements) },
        config
      );
      if (data.success) {
        router.push("/leads");
        return data.data as number;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { mutateAsync: handleCreateLeadForm, data } = useMutation(
    createLeadForm,
    {
      onSuccess: () => queryClient.invalidateQueries(`leads-${authUser?.uid}`),
    }
  );
  return (
    <AppLayout>
      <div>
        {/* <FormBuilder /> */}
        {uploadError && <ErrorMessage error={uploadError} />}
        <h2 className="flex-grow text-3xl tracking-wide font-medium ">
          Lead Form
        </h2>
        <div className="flex flex-col">
          <label htmlFor="leadFormTitle">
            Give it a name and message after someone submitted the form itself.
          </label>
        </div>
        <input
          id="leadFormTitle"
          className="p-1 rounded-md my-2 border-2 bg-none w-full outline-gray-300 transition-all duration-500 ease-in-out"
          maxLength={64}
          value={leadTitle}
          onChange={(e) => setLeadTitle(e.target.value)}
          required={true}
        />

        <div className="flex items-center w-full border-none">
          <div
            className={`w-1/2 text-center p-3 cursor-pointer border-t ${
              displayMode === DisplayMode.Create
                ? "bg-white border-b-0"
                : "bg-gray-200 border-b-2"
            }`}
            onClick={() => setDisplayMode(DisplayMode.Create)}
          >
            Create
          </div>
          <div
            className={`w-1/2 text-center  p-3 cursor-pointer border-t ${
              displayMode === DisplayMode.Preview
                ? "bg-white border-none"
                : "bg-gray-200 border-b-2"
            }`}
            onClick={() => setDisplayMode(DisplayMode.Preview)}
          >
            Preview
          </div>
          {/* <div
            className={`w-1/3 text-center  p-3 cursor-pointer border-t ${
              displayMode === DisplayMode.EmbededCode
                ? "bg-white border-none"
                : "bg-gray-200 border-b"
            }`}
            onClick={() => setDisplayMode(DisplayMode.EmbededCode)}
          >
            Embed Code
          </div> */}
        </div>
        {displayMode === DisplayMode.Create && (
          <form
            className="flex flex-col -my-1 border-t-0 bg-white"
            onSubmit={(e) => handleCreateLeadForm(e)}
          >
            <div className="p-4 mb-10">
              <h3 className="text-xl font-normal ">Create Lead Form</h3>
              <p>
                Create a lead form template to implement on your website. When
                clients fill in the lead form you will receive all the filled in
                information in your email and Octoa.
              </p>
            </div>
            <section className="bg-gray-100 w-full pt-10">
              {formElements.map((e, i) => (
                <LeadInputField
                  e={e}
                  key={i}
                  index={i}
                  formElements={formElements}
                  setFormElements={setFormElements}
                  mode={CreateMode.NEW}
                />
              ))}

              <div>
                <h3 className="bg-orange-theme p-2 rounded-md my-2">
                  Add extra fields
                </h3>
                <div className="flex flex-wrap">
                  <button
                    className="bg-blue-theme text-white p-2 rounded-md m-1"
                    type="button"
                    onClick={() =>
                      setFormElements((oldElements) => [
                        ...oldElements,
                        {
                          inputType: InputType.TEXT,
                          name: "",
                          required: true,
                          value: "",
                        },
                      ])
                    }
                  >
                    +Short Answer
                  </button>{" "}
                  <button
                    className="bg-blue-theme text-white p-2 rounded-md m-1"
                    type="button"
                    onClick={() =>
                      setFormElements((oldElements) => [
                        ...oldElements,
                        {
                          inputType: InputType.LONG_MESSAGE,
                          name: "",
                          required: true,
                          value: "",
                        },
                      ])
                    }
                  >
                    +Long Answer
                  </button>
                  <button
                    className="bg-blue-theme text-white p-2 rounded-md m-1"
                    type="button"
                    onClick={() =>
                      setFormElements((oldElements) => [
                        ...oldElements,
                        {
                          inputType: InputType.DATE,
                          name: "",
                          required: true,
                          value: "",
                        },
                      ])
                    }
                  >
                    +Date
                  </button>
                  {/* <button className="bg-blue-theme text-white p-2 rounded-md m-1" onClick={() =>
                      setFormElements((oldElements) => [
                        ...oldElements,
                        {
                          inputType: InputType.DATE,
                          name: "",
                          required: false,
                          value: "",
                        },
                      ])
                    }>
                    +Dropdown
                  </button> */}
                </div>
              </div>
              <button className="bg-green-700 rounded-md px-10 py-2 text-white float-right w-32">
                Save
              </button>
            </section>
          </form>
        )}
        {displayMode === DisplayMode.Preview && (
          <div className={`-mt-1 bg-white`}>
            <h3 className=" p-3 text-2xl ">Preview Form</h3>
            <LeadForm formElements={formElements} mode={LeadFormMode.PREVIEW} />
          </div>
        )}
        {displayMode === DisplayMode.EmbededCode && !data && (
          <div className={`-mt-1 bg-white`}>
            <p className="p-3 rounded-md bg-white text-center mt-10">
              You must save lead form in order to generate lead form
            </p>
          </div>
        )}
        {/* {displayMode === DisplayMode.EmbededCode && data && (
          <div className={`-mt-1 bg-white`}>
            <h3>Embed Link</h3>
          </div>
        )} */}
      </div>
    </AppLayout>
  );
};

export default Create;
