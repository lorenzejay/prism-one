import React, { ReactChild, ReactChildren, useState } from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";

const Layout = ({ children }: { children: ReactChild }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Header toggle={toggle} />
      <MobileNav toggle={toggle} isOpen={isOpen} />
      {children}
    </>
  );
};

export default Layout;
