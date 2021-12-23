import React from "react";

export const Footer = () => {
  return (
    <footer
      className="w-full px-5  py-12 lg:py-24 lg:px-12 xl:px-32 min-h-1/4 flex flex-col lg:flex-row justify-between text-white"
      style={{ background: "#1E1E1E" }}
    >
      <div className="flex flex-col">
        <h4 className="font-semibold text-xl tracking-wide">PRISM ONE CRM</h4>
        <p className="font-thin" style={{ color: "#7E7E7E" }}>
          Our mission is to optimize the business workflow.
        </p>
      </div>
      <div className="flex items-center">
        <p className="tracking-wide">
          © 2021 Prism One CRM, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
