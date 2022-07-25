import React from "react";
import Image from 'next/image';
import WaitlistForm from "./WaitlistForm";

const HeroTwo = () => {
  return (
    <main
      className="relative pb-10 flex flex-col-reverse lg:flex-row lg:py-16 lg:pt-0 items-center px-5  justify-between lg:px-12 xl:px-32 h-96 lg:h-5/8"
      style={{ background: "#1E1E1E", color: "#F7FAFC" }}
    >
      <section className="flex text-left md:text-center flex-col w-full h-full mx-auto pt-10 md:pt-20 lg:pt-16  justify-start ">
        <h1 className="text-2xl xs:text-3xl md:text-3xl lg:text-4xl font-bold tracking-[0.07em]">
          Organize Your Business <br /> Workflow In One Place.
        </h1>
        {/* <h3
          className="text-xl   lg:text-3xl xl:text-4xl text-gray-700 font-semibold mt-4 mb-2 "
          style={{ color: "#FEC828" }}
        >
          For Photographers, Videographers, and Artists.
        </h3> */}
        <label className="i5:text-base my-3 text-xl text-white w-full font-medium tracking-[0.03em]">
          Want to be notified when we launch? Enter your email below.
        </label>
        <WaitlistForm />

        <div className="i5:mt-10 mt-16 md:mt-48 lg:mt-24 lg:flex justify-center z-20">
          <section className="max-w-4xl bg-white rounded-xl shadow-2xl">
            <Image
              src="/colored_dash.png"
              width={1920}
              height={1080}
              className="rounded-t-xl bg-white h-full"
            />
          </section>
        </div>
      </section>
    </main>
  );
};

export default HeroTwo;
