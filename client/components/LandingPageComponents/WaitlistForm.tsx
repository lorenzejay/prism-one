import React, { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import Modal from "./Modal";

const WaitlistForm = () => {
  const [state, handleSubmit] = useForm("myylvbga");
  const [openModal, setOpenModal] = useState(false);
  if (state.succeeded) {
    return <p>Thanks for signing up!</p>;
  }
  return (
    <form
      className="flex items-center lg:w-1/2 lg:mx-auto text-gray-700"
      onSubmit={handleSubmit}
    >
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Enter your email"
        className="border rounded-md i5:p-2 p-3 lg:p-3 text-sm lg:text-base flex-grow mr-2 shadow-sm focus:outline-none"
      />
      <ValidationError prefix="Email" field="email" errors={state.errors} />
      <button
        className="i5:p-2 rounded-md border-none focus:outline-none p-3"
        style={{ background: "#F9BF52" }}
        disabled={state.submitting}
        type={"submit"}
      >
        Notify Me
      </button>
    </form>
  );
};

export default WaitlistForm;
