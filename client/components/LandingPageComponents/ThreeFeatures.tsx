import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faWallet, faImages } from "@fortawesome/free-solid-svg-icons";
const ThreeFeatures = () => {
  return (
    <div
      className="pt-64 lg:pt-72 2xl:pt-96 lg:pb-36 px-10  pb-10"
      style={{ background: "#F7FAFC" }}
    >
      <h3 className=" mx-auto text-center text-5xl leading-normal mb-24 font-bold w-1/2">
        One-stop Solution for All the Things You Need
      </h3>
      <section className="flex justify-center w-3/4 mx-auto items-center flex-col lg:flex-row ">
        <div className="flex flex-col items-center justify-center">
          <FontAwesomeIcon icon={faUsers} className="text-7xl" />
          <h3 className="font-bold text-3xl my-5">Client Tracking</h3>
          <p className="w-3/4 text-xl font-normal">
            Easily keep track and organize your client list. In a click of a
            button, you can send email marketing, personalized emails, or even
            contracts.
          </p>
        </div>
        <div
          className="flex flex-col items-center justify-center py-10 rounded-md"
          style={{ background: "#F9BF52" }}
        >
          <FontAwesomeIcon icon={faWallet} className="text-7xl" />
          <h3 className="font-bold text-3xl my-5">Get Paid</h3>
          <p className="w-3/4 text-xl font-normal">
            No more needing to hunt down clients for unpaid work. Easily track
            who owes what, remaining balances due, and sync payments directly to
            your bank account.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <FontAwesomeIcon icon={faImages} className="text-7xl" />
          <h3 className="font-bold text-3xl my-5">Delivery</h3>
          <p className="w-3/4 text-xl font-normal">
            Conclude the client lifecycle by uploading your files in a gallery.
            Deliverables will be viewed in a minimalistic / artsty way.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ThreeFeatures;
