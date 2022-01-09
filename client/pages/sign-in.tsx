import React, { useEffect, useState } from "react";
import Layout from "../components/LandingPageComponents/Layout";
import { useRouter } from "next/router";
import Link from "next/link";
import ErrorMessage from "../components/app/ErrorMessage";
import useFirebaseAuth from "../hooks/useAuth3";

const SignIn = () => {
  const router = useRouter();
  // const auth = getAuth(app);

  // const { signIn, userId, error } = useAuth();
  const { signInWithEmailAndPassword, authUser, authError, loading } =
    useFirebaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberUserSignIn, setRememberUserSignIn] = useState(false);

  useEffect(() => {
    if (authUser && !loading) {
      router.push("/home");
    }
  }, [authUser, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await signInWithEmailAndPassword({ email, password });
      window.localStorage.setItem(
        "rememberUserSignIn",
        JSON.stringify(rememberUserSignIn)
      );

      // if (error === null) {
      //   router.push("/home");
      // }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("error", error);
  const rememberLoginSignedState = () => {
    setRememberUserSignIn(!rememberUserSignIn);
  };
  // console.log("rememberUserSignIn:", rememberUserSignIn);
  return (
    <Layout>
      <>
        <form
          className="px-5 pb-4 pt-24 lg:py-10  lg:px-12 xl:px-32 flex justify-center flex-col"
          onSubmit={handleLogin}
        >
          <h1 className="text-center text-3xl ">Sign In</h1>
          {authError && <ErrorMessage error={authError} />}
          {/* {error && (
            <ErrorMessage
              error={
                "Something went wrong with the credentials, please try again."
              }
            />
          )} */}
          <input
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-3/4 lg:w-1/2 mx-auto border p-2 my-3"
            type="email"
          />
          <input
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-3/4 lg:w-1/2 mx-auto border p-2 my-3"
            type="password"
          />
          <button
            type="submit"
            className="border w-3/4 lg:w-1/2 mx-auto p-2 hover:bg-blue-500 transition duration-500 ease-in-out"
          >
            Log in
          </button>
          {/* <div className="flex items-center mt-5 w-3/4 lg:w-1/2  mx-auto">
            <label className="mr-2">Remember Me</label>
            <input
              type="checkbox"
              checked={rememberUserSignIn}
              onChange={rememberLoginSignedState}
            />
          </div> */}
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
