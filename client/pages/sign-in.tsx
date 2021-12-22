import React, { useEffect, useState } from "react";
import Layout from "../components/LandingPageComponents/Layout";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";

const SignIn = () => {
  const router = useRouter();
  // const auth = getAuth(app);
  const { signIn, userId, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (userId) {
      router.push("/home");
    }
  }, [userId]);

  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await signIn({ email, password });
      if (error === null) {
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("error:", error);
  return (
    <Layout>
      <>
        <form
          className="px-5 py-4 lg:py-10  lg:px-12 xl:px-32 flex justify-center flex-col"
          onSubmit={handleLogin}
        >
          <h1 className="text-center text-3xl ">Sign In</h1>
          {error && (
            <p className="text-red-600 mx-auto">
              Credentials not found, please try again.
            </p>
          )}
          <input
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            className="lg:w-1/2 mx-auto border p-2 my-3"
            type="email"
          />
          <input
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            className="lg:w-1/2 mx-auto border p-2 my-3"
            type="password"
          />
          <button
            type="submit"
            className="border lg:w-1/2 mx-auto p-2 hover:bg-blue-500 transition duration-500 ease-in-out"
          >
            Log in
          </button>
          <p className="mx-auto mt-10 text-sm ">
            If you don&apos;t have an account yet,{" "}
            <Link href="/register">
              <span className="font-bold underline cursor-pointer">
                Sign Up
              </span>
            </Link>
          </p>
        </form>
      </>
    </Layout>
  );
};

export default SignIn;
