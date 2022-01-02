import { auth } from "./firebaseInit";

export const generateUserToken = async (user_id: string) => {
  const customToken = await auth.createCustomToken(user_id);

  // console.log("customToken", customToken);
  return customToken;
};
