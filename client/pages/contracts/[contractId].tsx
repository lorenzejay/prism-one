import { Viewer, Worker } from "@react-pdf-viewer/core";
import axios from "axios";
import { getDownloadURL, getStorage, list, ref } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import AppLayout from "../../components/app/Layout";
import useFirebaseAuth from "../../hooks/useAuth3";
import { ContractTypes } from "../../types/contract";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"; // install this library
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Link from "next/link";

const IndvContract = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const router = useRouter();
  const { authUser } = useFirebaseAuth();
  const { contractId } = router.query;
  const [refPath, setRefPath] = useState<string | null>(null);
  const [file, setFile] = useState<any>();
  const [donwloadUrl, setDownloadUrl] = useState("");
  const storage = getStorage();
  // const listRef = ref(storage, refPath)
  const fetchContractById = async () => {
    try {
      if (!authUser?.token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: authUser.token,
        },
      };
      const { data } = await axios.get(
        `/api/contracts/list-contract/${contractId}`,
        config
      );
      if (data.success) {
        return data.data;
      }
      return;
    } catch (error) {
      return error;
    }
  };

  const { data: contract } = useQuery<ContractTypes>(
    `contract-${authUser?.uid}-${contractId}`,
    fetchContractById
  );
  console.log("contract", contract);

  useEffect(() => {
    if (contract?.firebase_path) {
      setRefPath(contract.firebase_path);
    }
  }, [contract]);
  const downloadFile = async (refPath: any) => {
    const url = await getDownloadURL(refPath);
    setDownloadUrl(url);
    return url;
  };

  useEffect(() => {
    if (refPath !== null) {
      const listRef = ref(storage, refPath);
      downloadFile(listRef);
    }
  }, [refPath]);

  return (
    <AppLayout>
      <div className="flex flex-col justify-start p-5 lg:">
        <Link href="/contracts">
          <h3 className="cursor-pointer w-full  lg:w-1/2 pt-10 text-gray-600 hover:text-black transition ease-in-out duration-500">
            Return to list
          </h3>
        </Link>
        <h3 className="text-3xl mb-5 tracking-wide ">
          {contract?.contract_name}
        </h3>
        <div className="max-h-1/2 relative">
          {donwloadUrl !== "" && (
            <>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.9.359/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={donwloadUrl}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default IndvContract;
