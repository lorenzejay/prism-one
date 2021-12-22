import React, {
  ChangeEventHandler,
  InputHTMLAttributes,
  useEffect,
  useState,
} from "react";
import FormBuilder from "../components/app/FormBuilder";
import AppLayout from "../components/app/Layout";
import { Cloudinary } from "cloudinary-core";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { preview } from "@cloudinary/url-gen/actions/videoEdit";
import { Document } from "react-pdf";
import { useMutation, useQuery, useQueryClient } from "react-query";
const Contracts = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { userToken, userId } = useAuth();
  const [contract_name, setContractName] = useState("");
  const [attached_file, setAttachedFile] = useState<any | null>();
  const [custom_contract, setCustomContract] = useState(false);
  const [text_field_response, setTextFieldResponse] = useState("");
  const [pdf, setPdf] = useState();
  const [previewSource, setPreviewSource] = useState<
    string | ArrayBuffer | null
  >();

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
    }
  }, [userId]);

  //add react-query
  //security checker for if file type is even a pdf

  const handleFileInputState = (e: any) => {
    //grabs the first file
    const file = e.target.files[0];
    setPdf(e.target.value);
    previewFile(file);
  };

  const previewFile = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); //convers images into a string
    reader.onloadend = () => {
      setPreviewSource(reader.result);
      setAttachedFile(reader.result);
    };
  };

  const listContracts = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: userToken,
        },
      };
      const { data } = await axios.get("/api/contracts/list-contracts", config);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const {
    data: contracts,
    error: listContractError,
    isLoading: listingContractLoading,
  } = useQuery("list-contracts", listContracts);

  const createContract = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: userToken,
        },
      };

      await axios.post(
        "/api/contracts/create-contract",
        { contract_name, attached_file, custom_contract, text_field_response },
        config
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const { mutateAsync: handleAddNewContract } = useMutation(createContract, {
    onSuccess: () => queryClient.invalidateQueries(`projectDeets-${userId}`),
  });
  console.log(contracts);

  console.log(previewSource);
  //   const client = filestack.init(apiKey);
  //   const handleOpenClientFilePicker = () => {
  //     client.picker().open();
  //   };
  return (
    <AppLayout>
      <>
        {/* <FormBuilder /> */}
        <form>
          <img src="https://res.cloudinary.com/dbingokq3/image/upload/v1635963147/ghrcitrhehfls9z5iptn.pdf" />
          {previewSource && <Document file={pdf} />}
          <label htmlFor="contract_name">Contract Name</label>
          <input
            className="contract_name"
            onChange={(e) => setContractName(e.target.value)}
            type="text"
          />
          {/* <label htmlFor="contract_file">
            If you have a pdf contract, you can attach it below
          </label> */}
          {/* <button onClick={handleOpenClientFilePicker}>Upload File</button> */}
          <input
            onChange={(e) => {
              console.log(e);
              handleFileInputState(e);
            }}
            className="contract_file"
            type="file"
            accept=".pdf, .docx"
          />
          <div className="bg-blue-300 flex flex-col ">
            <label htmlFor="contract_text">
              This agreement template is provided for your convenience. It is
              not provided as a substitute for legal advice. If you have any
              questions about this template or your finished contract, please
              contact a licensed attorney.
            </label>
            <textarea className="contract_text">dasd</textarea>
          </div>
          <button
            className="bg-green-300"
            onClick={() => handleAddNewContract()}
          >
            Save
          </button>
        </form>
      </>
    </AppLayout>
  );
};

export default Contracts;
