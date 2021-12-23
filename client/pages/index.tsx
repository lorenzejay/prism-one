import type { NextPage } from "next";
import HeroTwo from "../components/LandingPageComponents/HeroTwo";
import Layout from "../components/LandingPageComponents/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Features from "../components/LandingPageComponents/Features";
import { Footer } from "../components/LandingPageComponents/Footer";
const Home: NextPage = () => {
  // const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_KEY;
  return (
    <Layout>
      <>
        <HeroTwo />
        {/* <ThreeFeatures /> */}
        <Features />
        <section className="flex flex-col items-center lg:flex-row w-full px-5  py-12 lg:py-24 lg:px-12 xl:px-32 justify-between">
          <div className="flex flex-col  lg:w-1/2 mb-10 lg:mb-0 lg:mr-24">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-7xl text-blue-600 mx-auto lg:m-0"
            />
            <h3 className="font-extrabold w-full  tracking-normal text-4xl my-3 ">
              Simplify your business workflow into one application
            </h3>
            <p className="text-lg ">
              On average freelance photographers and videographers use 3 to 4
              programs in order to accomplish their business tasks. These
              programs can include communication, contracts, payments and
              sending the final deliverables. Why can&apos;t there be an app
              that simplifies everything in one app?
            </p>
          </div>

          <img src="/featureset_1.png" className="lg:w-1/2" />
        </section>
        <Footer />
      </>
    </Layout>
  );
};

export default Home;
