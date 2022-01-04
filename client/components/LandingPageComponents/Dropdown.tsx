import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
interface DropProps {
  title?: string;
  children: React.ReactNode;
}
const Dropdown = ({ title, children }: DropProps) => {
  const ref = useRef<any>(null);
  const [isDropped, setIsDropped] = useState(false);
  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsDropped(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      window.document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref]);

  return (
    <div className="flex items-center relative" ref={ref}>
      <p className="mr-2 tracking-wide">{title}</p>
      {!isDropped ? (
        <FontAwesomeIcon
          icon={faCaretDown}
          onClick={() => setIsDropped(true)}
        />
      ) : (
        <FontAwesomeIcon icon={faCaretUp} onClick={() => setIsDropped(false)} />
      )}
      {isDropped && (
        <div className="shadow-2xl absolute top-12 z-10  text-black  p-5 bg-gray-100 rounded-md w-72">
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
