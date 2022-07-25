import React from "react";
import Image from "next/image";

const features = [
  {
    imgSrc: "/prism-clients.svg",
    heading: "Simplified User Experience",
    description: "Declutter the unimportant things and focus on what matters - Your relationship with your clients."
  },
  {
    imgSrc: "/prism-automate.svg",
    heading: "Automating Lead Funnel",
    description: " Clients automatically added after signing your form. Automate the rest by scheduling emailing intervals to convert your leads to clients."
  },
  {
    imgSrc: "/prism-forms.svg",
    heading: "Manage and Track Projects",
    description: "Organize all your projects in one space. Add tags to represent the progress and keep track of upcoming due dates."
  },
]
const FeaturesSimplified = () => {
  return (
    <section
      className="pt-48 md:pt-64 lg:pt-96 2xl:pt-80 lg:pb-36 px-10  pb-10 flex flex-col items-center lg:grid lg:grid-cols-3 lg:justify-center w-full mx-auto space-y-12 lg:space-x-2"
      style={{ background: "#F7FAFC" }}
    >
      {
        features.map((feature, i) => (
          <div className="flex flex-col justify-center items-center lg:mb-0" key={i}>
            <div className="relative w-32 h-32">
              <Image src={feature.imgSrc} alt={`Graphic for ${feature.heading}`} layout='fill' />
            </div>
            <h3 className="text-xl font-medium my-5 tracking-[0.03em]">
              {feature.heading}
            </h3>
            <p className="text-center  text-gray-500 h-24">
              {feature.description}
            </p>
          </div>
        ))
      }
    </section>
  );
};

export default FeaturesSimplified;
