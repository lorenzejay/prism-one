import React, { useEffect, useRef, useState } from "react";
import { InputData, InputType } from "../../../types/leadsTypes";
interface LeadInputFieldProps {
  e: InputData;
  formElements: InputData[];
  setFormElements: React.Dispatch<React.SetStateAction<InputData[]>>;
  index: number;
}

const LeadInputField = ({
  e,
  formElements,
  setFormElements,
  index,
}: LeadInputFieldProps) => {
  const [title, setTitle] = useState("");

  const ref = useRef<any>();

  const [openLeadInputFieldSettings, setOpenLeadInputFieldSettings] =
    useState(false);
  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpenLeadInputFieldSettings(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      window.document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref]);

  useEffect(() => {
    if (e) {
      setTitle(e.name);
    }
  }, [e]);

  if (!openLeadInputFieldSettings) {
    return (
      <div
        className="bg-white my-10 flex flex-col px-3 py-6  cursor-pointer"
        onClick={() => setOpenLeadInputFieldSettings(true)}
      >
        <div className="flex justify-between w-full mb-2">
          <label htmlFor={e.name}>{e.name}</label>
          <p className="text-gray-400">{e.required ? "required" : ""}</p>
        </div>
        {e.inputType !== InputType.LONG_MESSAGE && (
          <input
            type={e.inputType}
            id={e.name}
            className="p-1 bg-none border-2 outline-gray-300 rounded-md "
            disabled={true}
          />
        )}
        {e.inputType === InputType.LONG_MESSAGE && (
          <textarea disabled={true}></textarea>
        )}
      </div>
    );
  } else {
    return (
      <div
        ref={ref}
        className="bg-white my-10 flex flex-col px-3 py-6  cursor-pointer"
      >
        <label>Field Label</label>
        <input
          placeholder="Label: EX) Email Address"
          type="text"
          id={e.name}
          className="p-1 bg-none border-2  outline-gray-300 rounded-md"
          value={title}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              let newArr = [...formElements];
              newArr[index].name = title;
              setFormElements(newArr);
            }
          }}
          onChange={(e) => {
            setTitle(e.target.value);
            let newArr = [...formElements];
            console.log(newArr[index]);
            newArr[index].name = e.target.value;
            setFormElements(newArr);
          }}
        />
        <hr className="my-5 z-10" />
        <div className="flex items-center">
          <label className="mr-3">Required:</label>
          <input
            type="checkbox"
            checked={e.required}
            onChange={(e) => {
              let newArr = [...formElements];

              newArr[index].required = !newArr[index].required;
              setFormElements(newArr);
            }}
          />
        </div>
        <p
          className="w-12 h-6  hover:border-b hover:border-red-600 transition-all duration-500 ease-in-out cursor-pointer"
          onClick={() =>
            setFormElements((prevElements) => {
              prevElements.pop();
              return [...prevElements];
            })
          }
        >
          Delete
        </p>
      </div>
    );
  }
};

export default LeadInputField;
