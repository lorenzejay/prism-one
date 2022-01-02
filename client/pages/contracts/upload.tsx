import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import {
  getStorage,
  ref,
  TaskState,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"; // install this library
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import useFirebaseAuth from "../../hooks/useAuth3";
import AppLayout from "../../components/app/Layout";
import SuccessMessage from "../../components/app/SuccessMessage";
import ErrorMessage from "../../components/app/ErrorMessage";
import Loader from "../../components/app/Loader";

const Upload = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const queryClient = useQueryClient();
  const storage = getStorage();
  const router = useRouter();
  const { authUser, loading } = useFirebaseAuth();
  const [contract_name, setContractName] = useState("");
  const [attached_file, setAttachedFile] = useState<File | null>(); //what is actually sent out to cloud storage
  const [custom_contract, setCustomContract] = useState(false);
  const [uploadState, setUploadState] = useState<TaskState>({} as TaskState);

  //previews
  const [pdf, setPdf] = useState<any>();
  const [pdfError, setPdfError] = useState("");

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/sign-in");
    }
  }, [loading, authUser]);

  //add react-query
  //security checker for if file type is even a pdf

  //we are only uploading pdf files
  const fileTypes = ["application/pdf"];
  const handleFileInputState = (e: any) => {
    //grabs the first file
    const file = e.target.files[0] as File;

    if (file) {
      if (file && fileTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.readAsDataURL(file); //convers images into a string
        reader.onloadend = (e) => {
          setPdf(e.target?.result);
          setPdfError("");
          // setAttachedFile(reader.result);
          setAttachedFile(file);
        };
      } else {
        setPdf(null);
        setPdfError("Please select a valid pdf file.");
      }
    }
  };

  const createContractWithFirebase = async (e: FormEvent) => {
    try {
      e.preventDefault();
      if (!authUser?.token) return;
      if (!attached_file || contract_name === "") return;
      const storageRef = ref(
        storage,
        `contract/${authUser?.uid}-${contract_name}`
      );

      const uploadTask = await uploadBytesResumable(storageRef, attached_file);
      //we have access to:
      //ref._location.bucket & .path_
      console.log("bytes trasnferred", uploadTask.bytesTransferred);
      switch (uploadTask.state) {
        case "running":
          setUploadState("running");
          break;
        case "paused":
          setUploadState("paused");
          break;
        case "error":
          setUploadState("error");
          break;
        case "success":
          setUploadState("success");

          break;
      }
      await handleAddNewContract(uploadTask);
    } catch (error) {
      console.log("error", error);
    }
  };

  const createContract = async (uploadTask: UploadTaskSnapshot) => {
    try {
      if (!authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser?.token,
        },
      };
      await axios.post(
        "/api/contracts/create-contract",
        {
          contract_name,
          location_bucket: uploadTask.ref.bucket,
          firebase_path: uploadTask.ref.fullPath,
          custom_contract,
        },
        config
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const { mutateAsync: handleAddNewContract } = useMutation(createContract, {
    onSuccess: () =>
      queryClient.invalidateQueries(`contracts-${authUser?.uid}`),
  });
  // console.log(contracts);

  // console.log(previewSource);
  //   const client = filestack.init(apiKey);
  //   const handleOpenClientFilePicker = () => {
  //     client.picker().open();
  //   };
  // console.log(contractList);
  // console.log(uploadState);
  return (
    <AppLayout>
      <>
        {/* <FormBuilder /> */}
        <form
          className="flex flex-col p-5 bg-white rounded-md"
          onSubmit={(e) => createContractWithFirebase(e)}
        >
          <h3 className="text-3xl mb-5 tracking-wide ">Create a Contract</h3>
          {uploadState === "success" && (
            <SuccessMessage success={"Upload Successful"} />
          )}
          {uploadState === "error" && <ErrorMessage error="Upload Failed" />}
          {uploadState === "running" && <Loader />}
          {pdfError && <ErrorMessage error={pdfError} />}
          {/* <img src="https://res.cloudinary.com/dbingokq3/image/upload/v1635963147/ghrcitrhehfls9z5iptn.pdf" /> */}
          <div className="max-h-1/2 relative">
            {pdf && (
              <>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.9.359/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={pdf}
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </Worker>
              </>
            )}
          </div>

          <label htmlFor="contract_name text-xl">Contract Name:</label>
          <input
            className="contract_name rounded-md border p-2 my-3 text-black"
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

          <button
            type="submit"
            className=" bg-blue-theme text-white rounded-md w-1/4 mt-5 p-2 relative top-0  hover:shadow-2xl transition-all duration-500 ease-in-out"
          >
            Upload
          </button>
        </form>
      </>
    </AppLayout>
  );
};

export default Upload;
