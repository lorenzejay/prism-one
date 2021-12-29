import React, { useState } from "react";
import AppLayout from "../../components/app/Layout";

const Index = () => {
  const [fileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState<any>("");
  const [title, setTitle] = useState("");
  const handleFileInputState = (e: any) => {
    //grabs the first file
    const file = e.target.files[0];
    previewFile(file);
  };

  const previewFile = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); //convers images into a string
    reader.onloadend = () => {
      setPreviewSource(reader.result as any);
    };
  };
  return (
    <AppLayout>
      <div className="px-10 py-5 lg:px-32 min-h-full">
        <h3 className="text-2xl font-semibold uppecase tracking-wide">
          Galleries
        </h3>
        <input
          type="file"
          name="uploader"
          value={fileInputState}
          onChange={handleFileInputState}
        />
      </div>
    </AppLayout>
  );
};

export default Index;
