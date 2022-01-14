import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../components/LandingPageComponents/Layout";
import useFirebaseAuth from "../../hooks/useAuth3";
import ErrorMessage from "../../components/app/ErrorMessage";
const Register = () => {
  const router = useRouter();
  const { authError } = useFirebaseAuth();
  const { createUserWithEmailAndPassword } = useFirebaseAuth();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [formError, setFormError] = useState("");
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormError("");
      //check if pass and confirm pass are the same
      if (confirmPassword !== password) {
        return setFormError("Passwords do not match");
      }

      await createUserWithEmailAndPassword({
        email,
        full_name: `${firstName} ${lastName}`,
        password,
        username,
      });

      router.push("/register/company");
    } catch (error: any) {
      console.log(error);
      setFormError(error.message);
    }
  };

  return (
    <Layout>
      <>
        <form
          className="px-5 pt-24 pb-4 lg:py-10  lg:px-12 xl:px-32 flex flex-col justify-center "
          onSubmit={(e) => handleRegister(e)}
        >
          <h1 className="text-center text-3xl ">Sign Up </h1>
          {formError && <ErrorMessage error={formError} />}
          {authError && <ErrorMessage error={authError} />}
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-3/4 lg:w-1/2 mx-auto border p-2 my-3"
            type="email"
          />
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-3/4 lg:w-1/2 mx-auto border p-2 my-3"
            type="text"
          />
          <div className="w-3/4 flex flex-col lg:flex-row lg:w-1/2 mx-auto ">
            <input
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full lg:w-1/2 mx-auto border p-2 my-3 mr-1"
              type="text"
            />
            <input
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              className="w-full lg:w-1/2 mx-auto border p-2 my-3"
              type="text"
            />
          </div>

          <input
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-3/4 lg:w-1/2 mx-auto border p-2 my-3"
            type="password"
          />

          <input
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-3/4 lg:w-1/2 mx-auto border p-2 my-3"
            type="password"
          />
          <button
            type="submit"
            className="border w-3/4 lg:w-1/2 mx-auto p-2 hover:bg-blue-500 transition duration-500 ease-in-out"
          >
            Create Account
          </button>
          <p className="mx-auto mt-10 text-sm">
            If you have an account already,{" "}
            <Link href="/sign-in">
              <span className="font-bold underline cursor-pointer">
                Sign In
              </span>
            </Link>
          </p>
        </form>
      </>
    </Layout>
  );
};

export default Register;
