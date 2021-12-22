import React from "react";
import Layout from "../components/LandingPageComponents/Layout";
import WaitlistForm from "../components/LandingPageComponents/WaitlistForm";

const Goals = () => {
  return (
    <Layout>
      <div className="flex flex-col py-10 px-5 ">
        <h1 className="mx-auto font-bold text-5xl lg:text-4xl lg:w-1/2 text-center">
          Traditional CRM&apos;s can be overwhelming. Let Prism One help you
          focus on creating by simplify your business side.
        </h1>
        <h3 className="my-10 font-semibold mx-auto text-xl text-center w-3/4 ">
          Focused on simplfying the business process to cater directly to your
          needs.
        </h3>
        <p className="text-xl mb-10 lg:w-3/4 leading-10 lg:mx-auto">
          I started Prism One after using many traditional CRM applications and
          other tools to run my freelance photography filmmaking business.
          Combining apps from Tave to Pictime then Honeybook then last to
          Dropbox was just too much to juggle at a certain scale. I thought to
          myself, isn&apos;t there something that could fit everything I needed
          into one application?
        </p>
        <p className="text-xl mb-10 lg:w-3/4 leading-10 lg:mx-auto">
          Additionally, traditional CRM&apos;s are daunting just looking at it.
          CRM&apos;s are powerful business tools but it may dissuade many
          smaller freeancers from using one due to it&apos;s steep learning
          curve. With my background in the creative freelance industry and in
          tech, I decided to make an application that addressed the problem I
          had. Prism One&apos;s goals is to create a workflow that is easy to
          use, yet has all the features needed to run a freelance creative
          business. From tracking your clients inquiries to your final
          deliverables, Prism One has you covered.
        </p>
        <p className="text-xl mb-10 lg:w-3/4 leading-10 lg:mx-auto">
          While the application is still in development, enter your email to get
          notified when we launch.
        </p>
        <WaitlistForm />
      </div>
    </Layout>
  );
};

export default Goals;
