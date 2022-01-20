import React from "react";

const FeaturesSimplified = () => {
  return (
    <section
      className="pt-36 md:pt-64 lg:pt-96 2xl:pt-64 lg:pb-36 px-10  pb-10 flex flex-col items-center lg:grid lg:grid-cols-3 lg:justify-center w-full mx-auto"
      style={{ background: "#F7FAFC" }}
    >
      <div className=" flex flex-col justify-center items-center mb-10 mx-5 lg:mb-0">
        <img src="/prism-clients.svg" className="w-48" />
        <h3 className="text-xl font-medium my-5 ">
          Simplified User Experience
        </h3>
        <p className="text-center  text-gray-500">
          Declutter the unimportant things and focus on what matters - Your
          relationship with your clients.
        </p>
      </div>

      <div className="flex flex-col  justify-center  items-center mb-10 mx-5 lg:mb-0">
        <img src="/prism-automate.svg" className="w-48" />
        <h3 className="text-xl font-medium my-5 ">Automating Lead Funnel</h3>
        <p className="text-center text-gray-500">
          Clients automatically added after signing your form. Automate the rest
          by scheduling emailing intervals to convert your leads to clients.
        </p>
      </div>

      <div className=" flex flex-col items-center mb-10 mx-5 lg:mb-0">
        <img src="/prism-forms.svg" className="w-48" />
        <h3 className="text-xl font-medium my-5 ">Manage and Track Projects</h3>
        <p className="text-center text-gray-500">
          Organize all your projects in one space. Add tags to represent the
          progress and keep track of upcoming due dates.
        </p>
      </div>
    </section>
  );
};

export default FeaturesSimplified;
