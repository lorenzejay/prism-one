import { useRouter } from "next/router";
import React, { ReactChild, useEffect, useState } from "react";
import { CurrentDash } from "../../types/UITypes";
import AppHeader from "./header";
import Sidebar from "./sidebar";

const AppLayout = ({ children }: { children: ReactChild }) => {
  const [currentDash, setCurrentDash] = useState<string>(CurrentDash.Home);
  const [minimizeSidebar, setMinimizeSidebar] = useState(false);

  const router = useRouter();
  const path = router.pathname.slice(1, router.pathname.length);
  useEffect(() => {
    const lastDash = window.localStorage.getItem("currentDash");
    if (path !== lastDash) {
      setCurrentDash(path as CurrentDash);
    }
    if (lastDash) {
      setCurrentDash(lastDash as CurrentDash);
    } else {
      path[0].toUpperCase;
      setCurrentDash(path as CurrentDash);
      window.localStorage.setItem("currentDash", path);
    }
  }, []);
  return (
    <>
      <AppHeader />
      <div className="flex flex-col lg:flex-row w-full py-5 px-12 lg:px-24">
        <Sidebar
          currentDash={currentDash}
          setCurrentDash={setCurrentDash}
          minimizeSidebar={minimizeSidebar}
          setMinimizeSidebar={setMinimizeSidebar}
        />
        <main className="bg-gray-100 flex-grow p-4 w-full lg:w-5/6 rounded-md  min-h-full">
          {children}
        </main>
      </div>
    </>
  );
};

export default AppLayout;
