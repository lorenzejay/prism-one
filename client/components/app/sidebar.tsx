import React, { useState } from "react";
import Link from "next/link";
enum CurrentDash {
  Home = "Home",
  Clients = "Clients",
  Jobs = "Jobs",
  Email = "Email",
  Tasks = "Tasks",
  Contracts = "Contracts",
  Analytics = "Analytics",
  Feedback = "Feedback",
  Galleries = "Galleries",
}
const Sidebar = () => {
  const [currentDash, setCurrentDash] = useState<CurrentDash>(CurrentDash.Home);

  return (
    <div className="flex flex-col lg:w-1/6 ">
      <ul className="">
        <Link href="/home">
          <li className="mb-5">
            <button
              onClick={() => setCurrentDash(CurrentDash.Home)}
              className="cursor-pointer  text-left focus:bg-gray-100 w-full p-2 focus:border-l-2 focus:border-yellow-600"
            >
              Dashboard
            </button>
          </li>
        </Link>
        <li className="mb-5">
          <button
            onClick={() => setCurrentDash(CurrentDash.Clients)}
            className="cursor-pointer  text-left focus:bg-gray-100 w-full p-2 focus:border-l-2 focus:border-yellow-600"
          >
            <Link href="/clients">Clients</Link>
          </button>
        </li>
        <Link href="/projects">
          <li className="mb-5">
            <button
              onClick={() => setCurrentDash(CurrentDash.Jobs)}
              className="cursor-pointer  text-left focus:bg-gray-100 w-full p-2 focus:border-l-2 focus:border-yellow-600"
            >
              Projects
            </button>
          </li>
        </Link>
        <Link href="/tasks">
          <li className="mb-5">
            <button
              onClick={() => setCurrentDash(CurrentDash.Tasks)}
              className="cursor-pointer  text-left focus:bg-gray-100 w-full p-2 focus:border-l-2 focus:border-yellow-600"
            >
              Tasks
            </button>
          </li>
        </Link>
        <Link href="/email">
          <li className="mb-5">
            <button
              onClick={() => setCurrentDash(CurrentDash.Email)}
              className="cursor-pointer  text-left focus:bg-gray-100 w-full p-2 focus:border-l-2 focus:border-yellow-600"
            >
              Email
            </button>
          </li>
        </Link>

        <Link href="contracts">
          <li className="mb-5">
            <button
              onClick={() => setCurrentDash(CurrentDash.Contracts)}
              className="cursor-pointer text-left focus:bg-gray-100 w-full p-2 focus:border-l-2 focus:border-yellow-600"
            >
              Contracts
            </button>
          </li>
        </Link>
        <Link href="Galleries">
          <li className="mb-5">
            <button
              onClick={() => setCurrentDash(CurrentDash.Galleries)}
              className="cursor-pointer text-left focus:bg-gray-100 w-full p-2 focus:border-l-2 focus:border-yellow-600"
            >
              Galleries
            </button>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
