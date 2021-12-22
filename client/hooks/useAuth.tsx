import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactChild,
} from "react";
import { auth } from "../utils/firebase";
import { User } from "firebase/auth";

enum Currency {
  "Euro",
  "United_States_Dollar",
  "Canadian_Dollar",
  "Polish_zloty",
  "Norwegian_Krone",
}

interface UserSigningInDetails {
  email: string;
  password: string;
}

interface RegisteringUserDetails {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  username: string;
}
type AuthContextType = {
  userToken: string | null;
  registerUser: ({
    email,
    first_name,
    last_name,
  }: RegisteringUserDetails) => void;
  error: string | null;
  logout: () => void;
  signIn: ({ email, password }: UserSigningInDetails) => void;
  userId: string | null | User;
  username: string | null;
};
const ISSERVER = typeof window === "undefined";
const localUserToken =
  (!ISSERVER && window.localStorage.getItem("userToken")) || null;

//initalizing user context, by defaults should be empty

const AuthContext = createContext<AuthContextType>({
  userToken: localUserToken,
  registerUser: async () => null,
  error: null,
  logout: () => {},
  signIn: async () => {},
  userId: null,
  username: null,
});
const { Provider } = AuthContext;

export const AuthProvider = ({ children }: { children: ReactChild }) => {
  const auth = useAuthProvider();
  //wraps our app with the user context = gives us who is logged in for our entire app
  return <Provider value={auth}>{children}</Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

const useAuthProvider = () => {
  let localUser = null;
  if (!ISSERVER) {
    localUser = window.localStorage.getItem("userToken");
  }
  const [userToken, setUserToken] = useState<string | null>(
    localUser ? JSON.parse(localUser) : null
  );
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<string | User | null>(null);
  const [error, setError] = useState<string | null>(null);
  console.log("usertoken: ", userToken);
  console.log("userId: ", userId);
  useEffect(() => {
    const userToken = window.localStorage.getItem("userToken");
    if (!userToken || userToken === null) {
      window.localStorage.setItem("userToken", JSON.stringify(userToken));
    }
  }, []);
  useEffect(() => {
    if (userToken !== null) {
      getUserId();
    }
  }, []);
  const getUsername = async () => {
    try {
      console.log("getting username");
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: userToken,
        },
      };
      const { data } = await axios.get<{ username: string }>(
        "/api/users/get-username",
        config
      );
      if (!data) return;

      setUsername(data.username);
    } catch (error) {
      console.log(error);
    }
  };
  const getUserId = async () => {
    try {
      if (!userToken) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: userToken,
        },
      };
      const user = await axios.get<{ userId: string }>(
        `/api/users/get-user-id/${userToken}`,
        config
      );
      console.log("user", user.data.userId);
      setUserId(user.data.userId);
    } catch (error) {
      console.log(error);
    }
  };

  const registerUser = async ({
    email,
    first_name,
    last_name,
    password,
    username,
  }: RegisteringUserDetails) => {
    try {
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
        setError(null);
        setUserId(data.id);
        await auth.signInWithEmailAndPassword(email, password);
        const token = await auth.currentUser?.getIdToken(true);
        // console.log("t", token);
        if (token) {
          setUserToken(token);
          return localStorage.setItem("userToken", JSON.stringify(token));
        }
      }
    } catch (error) {
      console.log("user register error :", error);
      return error;
    }
  };

  // const loginWithGoogle = async () => {
  //   try {
  //     const { user } = await auth.signInWithPopup(googleProvider);
  //     if (user) {
  //       await createUser({
  //         uid: user.uid,
  //         email: user.email,
  //         name: user.displayName,
  //       });
  //       setError(null);
  //     }
  //   } catch (err) {
  //     setError(err);
  //     console.log(error);
  //   }
  // };

  const getUserToken = async (user: User) => {
    try {
      if (user === null) return;
      const userToken = await auth.currentUser?.getIdToken(true);
      return userToken;
    } catch (error) {
      console.log(error);
    }
  };

  //sign in
  const signIn = async ({ email, password }: UserSigningInDetails) => {
    try {
      const userSignedIn = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      console.log("userSignedIn", userSignedIn);
      if (!userSignedIn.user) return;
      setUserId(userSignedIn.user.uid);
      setError(null);
      const userToken = await getUserToken(userSignedIn.user as User);
      if (userToken) {
        setUserToken(userToken);
        return localStorage.setItem("userToken", JSON.stringify(userToken));
      }
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }
  };

  // //update the users about
  // const updateAbout = async (about) => {
  //   try {
  //     //makes sure theres a user
  //     if (user === null) return;
  //     await db.collection("users").doc(user.uid).update({
  //       about,
  //     });
  //     //should trigger update the things in user once there is update
  //     getUserAdditionalData(user);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // //update profilePicture
  // const updateProfilePic = async (file) => {
  //   const storageRef = storage.ref();
  //   const fileRef = storageRef.child(toSendPP.name);
  //   await fileRef.put(file);
  //   const fileUrl = await fileRef.getDownloadURL();

  //   //upload to firestore
  //   if (user) {
  //     await db.collection("users").doc(user.uid).update({
  //       profilePic: fileUrl,
  //     });
  //   }
  // };

  //if we refresh our data still remains without having to store our userid inside localstorage
  // const handleAuthStateChanged = (user: User | null) => {
  //   if (user) {
  //     setUserId(user?.uid);
  //     const token = getUserToken(user);
  //   } else {
  //     setUserId(null);
  //   }
  // };
  const unsub = () => {
    auth.onAuthStateChanged(async (user) => {
      try {
        if (user === null) {
          setUserToken(null);
          return localStorage.removeItem("userToken");
        }
        await getUsername();
        setUserId(user.uid);

        const userToken = await getUserToken(user as User);
        if (userToken) {
          setUserToken(userToken);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };
  useEffect(() => {
    return () => unsub();
  }, []);

  const logout = () => {
    return auth
      .signOut()
      .then(() => {
        setUserId(null);
        setError(null);
        setUserToken(null);
        localStorage.removeItem("userToken");
      })
      .catch((err: any) => {
        setError(err);
        return { err };
      });
  };

  // const deleteItemFromWishList = async();

  //what our state has access too from useAuth hook
  return {
    userToken,
    signIn,
    error,
    logout,
    registerUser,
    userId,
    username,
  };
};
