import { createContext, useContext, Context, ReactChild } from "react";
import useFirebaseAuth from "../hooks/useAuth3";
// import useFirebaseAuth from '../lib/useFirebaseAuth';
interface UserSigningInDetails {
  email: string;
  password: string;
}
const authUserContext = createContext({
  authUser: null,
  loading: true,
  signInWithEmailAndPassword: async ({}: UserSigningInDetails) => {},
  createUserWithEmailAndPassword: async ({}: UserSigningInDetails) => {},
  signOut: async () => {},
  username: String,
  authError: String,
});

export function AuthUserProvider({ children }: { children: ReactChild }) {
  const auth = useFirebaseAuth();
  return (
    <authUserContext.Provider value={auth as any}>
      {children}
    </authUserContext.Provider>
  );
}

export const useAuth = () => useContext(authUserContext);
