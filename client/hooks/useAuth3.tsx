import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import firebase from "../utils/firebase";
// import firebase from './firebase';

const formatAuthUser = (user: User) => ({
  uid: user.uid,
  email: user.email,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<{
    uid: string | null;
    email: string | null;
  } | null>();
  const [loading, setLoading] = useState(true);
  console.log("user", authUser);
  const authStateChanged = async (authState: User) => {
    if (!authState) {
      setLoading(false);
      return;
    }

    setLoading(true);

    var formattedUser = formatAuthUser(authState);

    setAuthUser(formattedUser);

    setLoading(false);
  };

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signInWithEmailAndPassword = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => firebase.auth().signInWithEmailAndPassword(email, password);

  const createUserWithEmailAndPassword = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => firebase.auth().createUserWithEmailAndPassword(email, password);

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
  };
}
