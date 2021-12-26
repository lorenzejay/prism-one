import React from "react";

const ErrorMessage = ({ error }: { error: string }) => {
  return (
    <div className="rounded-md bg-white w-1/2 mx-auto relative p-5 text-red-600 my-8">
      {error}
    </div>
  );
};

export default ErrorMessage;
