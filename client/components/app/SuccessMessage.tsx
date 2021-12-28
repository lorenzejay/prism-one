import React from "react";

const SuccessMessage = ({ success }: { success: string }) => {
  return (
    <div className="rounded-md bg-white shadow-2xl  w-full text-center mx-auto relative p-5 text-green-600 my-8">
      {success}
    </div>
  );
};

export default SuccessMessage;
