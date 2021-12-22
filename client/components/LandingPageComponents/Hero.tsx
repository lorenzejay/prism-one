import React from "react";

const Hero = () => {
  return (
    <main
      className="relative flex flex-col-reverse lg:flex-row pt-12 lg:py-16 lg:pt-0 items-center px-5  justify-between lg:px-12 xl:px-32 lg:h-screen"
      style={{ background: "#F3F4F3" }}
    >
      <img
        src="/prism-1.jpg"
        className="w-full  pb-10 mt-10 md:h-96 object-cover lg:mt-0 lg:w-1/3 lg:h-3/4 rounded-md"
      />
      <div className="flex flex-col w-full lg:w-1/2">
        <h1 className="text-3xl lg:text-5xl font-bold flex-col">
          Organize Your Business Workflow In One Place.
        </h1>
        <h3 className="text-xl lg:text-3xl text-gray-700 font-semibold mt-4 mb-2">
          For Photographers, Videographers, and Artists.
        </h3>
        <label className="my-3 text-base text-gray-700 w-full">
          Want to be notified when we launch? Enter your email below.
        </label>
        <p className="text-2xl mb-3"></p>
        <div className="flex items-center">
          <input
            placeholder="janedoephotos@gmail.com"
            className="border rounded-md p-3 flex-grow mr-2 shadow-sm"
          />
          <button
            className="rounded-md border-none focus:outline-none p-3"
            style={{ background: "#F9BF52" }}
          >
            Notify Me
          </button>
        </div>
      </div>
    </main>
  );
};

export default Hero;
