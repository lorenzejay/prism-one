import axios from "axios";
import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import firebase from "../utils/firebase";
// import firebase from './firebase';

const formatAuthUser = async (user: User) => {
  const token = await user.getIdToken();
  return {
    uid: user.uid,
    email: user.email,
    token: token,
  };
};

export default function useFirebaseAuth() {
  const [username, setUsername] = useState("");
  const [authUser, setAuthUser] = useState<{
    uid: string | null;
    email: string | null;
    token: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("user", authUser);
  const authStateChanged = async (authState: User) => {
    if (!authState) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const formattedUser = await formatAuthUser(authState);
    if (formattedUser) {
      setAuthUser(formattedUser);
    }
    await getUsername();
    setLoading(false);
  };

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const getUsername = async () => {
    if (authUser === null) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: authUser.token,
      },
    };
    const { data } = await axios.get<{ username: string }>(
      `/api/users/get-username`,
      config
    );
    if (data) {
      setUsername(data.username);
    }
    // console.log("user", user.data.userId);
  };

  const signInWithEmailAndPassword = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => firebase.auth().signInWithEmailAndPassword(email, password);

  interface SignUpProperty {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    username: string;
  }

  const createUserWithEmailAndPassword = async ({
    email,
    password,
    first_name,
    last_name,
    username,
  }: SignUpProperty) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post<{
      success: boolean;
      message: string;
      id: string;
    }>(
      "/api/users/register",
      {
        email,
        first_name,
        last_name,
        password,
        username,
      },

      config
    );
    if (data.success) {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    }
  };

  const signOut = () => firebase.auth().signOut().then(clear);

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(authStateChanged as any);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    username,
  };
}
