import * as admin from "firebase-admin";
import jwt, { Secret } from "jsonwebtoken";

export const generateUserToken = async (user_id: string) => {
  const customToken = await admin.auth().createCustomToken(user_id);

  console.log("customToken", customToken);
  return customToken;
  //   const payload = {
  //     user: user_id,
  //   };

  //   return jwt.sign(payload, process.env.JWT_SECRET as Secret, {
  //     expiresIn: "40d",
  //     algorithm: "RS256",
  //   });
};
