import React, { useEffect, useRef } from "react";
import { ReactFormBuilder } from "react-form-builder2";
const FormBuilder = () => {
  const ref = useRef(null);
  useEffect(() => {
    console.log(ref.current);
  }, []);
  const items = [
    {
      key: "Header",
      name: "Header Text",
      icon: "fa fa-header",
      static: true,

      content: "Placeholder Text...",
    },
    {
      key: "Paragraph",
      name: "Paragraph",
      static: true,
      icon: "fa fa-paragraph",
      content: "Placeholder Text...",
    },
  ];
  return (
    <>
      <div className="flex">
        <ReactFormBuilder toolbarItems={items} ref={ref} />
      </div>
    </>
  );
};

export default FormBuilder;
