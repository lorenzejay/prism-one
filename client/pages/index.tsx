import type { NextPage } from "next";
import Image from 'next/image'
import HeroTwo from "../components/LandingPageComponents/HeroTwo";
import Layout from "../components/LandingPageComponents/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Footer } from "../components/LandingPageComponents/Footer";
import FeaturesSimplified from "../components/LandingPageComponents/FeaturesSimplified";
import Head from "next/head";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
const Home: NextPage = () => {
  // const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_KEY;
  return (
    <Layout>
      <>
        <Head>
          <style>{dom.css()}</style>
        </Head>
        <HeroTwo />
        <FeaturesSimplified />
        {/* <Features /> */}
        <section className="flex flex-col items-center lg:flex-row w-full px-5 py-12 lg:py-24 lg:px-12 xl:px-32 justify-between">
          <div className="flex flex-col lg:w-1/2 mb-10 lg:mb-0 lg:mr-24">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-7xl text-blue-600 mx-auto lg:m-0"
            />
            <h3 className="font-extrabold w-full tracking-[0.03em] text-3xl xs:text-4xl my-3 ">
              Simplify your business workflow into one application
            </h3>
            <p className="text-lg ">
              On average use 3 applications in order to accomplish their
              business tasks. These apps handle communication, contracts,
              payments and sending the final deliverables. Why can&apos;t there
              be an app that simplifies everything in one app?
            </p>
          </div>
          <div className="lg:w-1/2 max-w-md">
            <Image src="/workflow-example.png" alt="Workflow showing client signups to getting booked" width={1057} height={1193} />
          </div>
        </section>
        <Footer />
      </>
    </Layout>
  );
};

export default Home;
