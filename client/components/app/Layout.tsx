import React, { ReactChild } from "react";
import AppHeader from "./header";
import Sidebar from "./sidebar";

const AppLayout = ({ children }: { children: ReactChild }) => {
  return (
    <>
      <AppHeader />
      <div className="flex w-full py-5 px-12 lg:px-24">
        <Sidebar />
        <div className="bg-gray-100 flex-grow p-4 w-5/6  rounded-md  min-h-full">
          {children}
        </div>
      </div>
    </>
  );
};

export default AppLayout;
