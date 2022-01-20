import React from "react";
import WaitlistForm from "./WaitlistForm";
const HeroTwo = () => {
  return (
    <main
      className="relative pb-10 flex flex-col-reverse lg:flex-row lg:py-16 lg:pt-0 items-center px-5  justify-between lg:px-12 xl:px-32 h-full lg:h-5/8"
      style={{ background: "#1E1E1E", color: "#F7FAFC" }}
    >
      <section className="flex text-left md:text-center flex-col w-full h-full  mx-auto pt-10 md:pt-20 lg:pt-16  justify-start ">
        <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold ">
          Organize Your Business Workflow In One Place.
        </h1>
        <h3
          className="text-xl   lg:text-3xl xl:text-4xl text-gray-700 font-semibold mt-4 mb-2 "
          style={{ color: "#FEC828" }}
        >
          For Photographers, Videographers, and Artists.
        </h3>
        <label className="i5:text-base my-3 text-xl text-white w-full">
          Want to be notified when we launch? Enter your email below.
        </label>
        <WaitlistForm />

        <div className="i5:mt-10 mt-16 md:mt-48 lg:mt-56 xl:mt-64 2xl:mt-52 lg:flex justify-center z-20">
          <section className="relative w-full ">
            <img
              src="/colored_dash.png"
              className="lg:w-3/6 xl:w-4/6 2xl:w-3/5 3xl:w-1/2  lg:mx-auto shadow-2xl rounded-b-xl"
            />
          </section>
        </div>
      </section>
    </main>
  );
};

export default HeroTwo;
