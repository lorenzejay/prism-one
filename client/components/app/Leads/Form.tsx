import axios from "axios";
import React, { FormEvent } from "react";
import { useMutation } from "react-query";
import { InputData, InputType, LeadFormMode } from "../../../types/leadsTypes";
import ErrorMessage from "../ErrorMessage";
import Loader from "../Loader";
import SuccessMessage from "../SuccessMessage";

interface LeadFormProps {
  formElements: InputData[];
  mode: LeadFormMode;
  leadId?: number;
  formOwner?: string;
}
const LeadForm = ({ formElements, mode, leadId, formOwner }: LeadFormProps) => {
  // const [successMessage, setSuccessMessage] = useState()
  const uploadLeadForm = async (e: FormEvent) => {
    try {
      e.preventDefault();

      let inputValues: any[] = [];
      const inputs = window.document.querySelectorAll("input, textarea");
      // const textarea = window.document.querySelectorAll("textarea");
      // const labels = window.document.querySelectorAll("label");
      inputs.forEach((i: any) => {
        const { id, value } = i;
        const data = {
          key: id,
          value,
        };
        inputValues.push(data);
      });
      // console.log("inputValues", inputValues);

      await axios.post(`/api/leads/upload-form-response/${leadId}`, {
        response: JSON.stringify(inputValues),
        formOwner,
      });
    } catch (error) {
      return error;
    }
  };

  const {
    mutateAsync: handleUploadLeadForm,
    isLoading,
    isSuccess,
    isError,
  } = useMutation(uploadLeadForm, {
    onSuccess: (data) => console.log(data),
  });

  //   useEffect(() => {

  //     // console.log(inputValues);
  //     setResponses(inputValues);
  //   }, []);
  return (
    <>
      {isLoading && <Loader />}
      {isError && (
        <ErrorMessage error="Something went wrong, please try again" />
      )}
      {formElements && (
        <form
          className={`${
            mode === LeadFormMode.CLIENT ? "w-1/2 mx-auto pt-10" : ""
          } flex flex-col items-center justify-center -my-1 border-t-0 p-4 h-auto`}
          onSubmit={handleUploadLeadForm}
        >
          {formElements.map((e, i) => {
            if (e.inputType === InputType.LONG_MESSAGE) {
              return (
                <div
                  key={i}
                  className="w-full bg-white my-4 flex flex-col px-3  cursor-pointer"
                >
                  <label htmlFor={e.name} className="text-xl">
                    {e.name}
                  </label>
                  <textarea
                    id={e.name}
                    required={e.required}
                    className="p-1 bg-none border-2  outline-gray-300 rounded-md"
                  ></textarea>
                  {e.required && <p className="text-red-600">Required</p>}
                </div>
              );
            } else {
              return (
                <div
                  key={i}
                  className="w-full bg-white my-4 flex flex-col px-3   cursor-pointer"
                >
                  <label htmlFor={e.name} className="text-xl">
                    {e.name}
                  </label>
                  <input
                    type={e.inputType}
                    id={e.name}
                    required={e.required}
                    className="p-1 bg-none border-2  outline-gray-300 rounded-md"
                  />
                  {e.required && <p className="text-red-600">Required</p>}
                </div>
              );
            }
          })}
          <button
            className="border-2 bg-none hover:shadow-2xl px-10 py-1 rounded-md transition-all duration-500 ease-in-out "
            type="submit"
            disabled={mode === LeadFormMode.PREVIEW ? true : false}
          >
            Submit
          </button>
          {isSuccess && (
            <SuccessMessage success="Thank you for responding, we will get back to you shortly." />
          )}
        </form>
      )}
    </>
  );
};

export default LeadForm;
