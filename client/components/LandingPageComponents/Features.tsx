import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
const Features = () => {
  return (
    <div
      className="pt-36 lg:pt-72 xl:pt-80 2xl:pt-64 lg:pb-36 px-10  pb-10 flex flex-col items-center lg:grid lg:grid-cols-3  lg:gap-10 w-full mx-auto"
      style={{ background: "#F7FAFC" }}
    >
      <div className="text-center mb-10 lg:mb-0 lg:text-base flex flex-col justify-middle  lg:pl-24">
        <h2 className="text-4xl font-medium ">
          All the features you need{" "}
          <span className="text-4xl font-medium " style={{ color: "#F9BF52" }}>
            in one place
          </span>
        </h2>
      </div>
      <div className="flex flex-col items-center mb-10 lg:mb-0">
        <img src="/prism-clients.svg" className="w-48" />
        <h3 className="text-xl font-medium my-3 ">
          List your potential clients
        </h3>
        <p className="lg:w-1/2 text-gray-500">
          Add clients to your contact list to easily send contracts and emails.
        </p>
      </div>
      <div className="flex flex-col items-center content-start mb-10 lg:mb-0">
        <img src="/prism-forms.svg" className="w-48" />
        <h3 className="text-xl font-medium ">
          Templates for Contracts and Emails
        </h3>
        <p className="text-start lg:w-1/2 text-gray-500">
          Use templates to speed up your business process.
        </p>
      </div>
      <div className="flex flex-col items-center mb-10 lg:mb-0">
        <img src="/prism-automate.svg" className="w-48" />
        <h3 className="text-xl font-medium my-3">Automate your jobs</h3>
        <p className="lg:w-1/2 text-gray-500">
          Create new jobs and quickly send out templated emails and contracts.
        </p>
      </div>
      <div className="flex flex-col items-center mb-10 lg:mb-0">
        <img src="/prism-calendar.svg" className="w-48" />
        <h3 className="text-xl font-medium my-3">Organized Scheduling</h3>
        <p className="lg:w-1/2 text-gray-500">
          Organized calendar so you never miss a date.
        </p>
      </div>

      <div className="flex flex-col items-center mb-10 lg:mb-0">
        <img src="/prism-gallery.svg" className="w-48" />
        <h3 className="text-xl font-medium my-3">Payment Integrations</h3>
        <p className="lg:w-1/2 text-gray-500">
          Get paid on time and be worry free.
        </p>
      </div>
      <div className="flex flex-col items-center mb-10 lg:mb-0">
        <img src="/prism-todos.svg" className="w-48" />
        <h3 className="text-xl font-medium my-3">Write Todos</h3>
        <p className="lg:w-1/2 text-gray-500">
          Easily create tasks you keep you organized.
        </p>
      </div>
      <div className="flex flex-col items-center mb-10 lg:mb-0">
        <img src="/prism-gallery.svg" className="w-48" />
        <h3 className="text-xl font-medium my-3">Send clients galleries</h3>
        <p className="lg:w-1/2 text-gray-500">
          Send your final work in a modern digital art gallery.
        </p>
      </div>
      <div className="flex justify-center items-center">
        <Link href="/goals">
          <button
            className="px-5 w-full py-3 rounded-md"
            style={{ background: "#F9BF52" }}
          >
            Learn More <FontAwesomeIcon size={"sm"} icon={faArrowRight} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Features;
