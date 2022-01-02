import { Response, NextFunction } from "express";
require("dotenv").config();
import { auth } from "../utils/firebaseInit";
// //checks if the token is valid
const authorization = async (req: any, res: Response, next: NextFunction) => {
  try {
    const decodedToken = await auth.verifyIdToken(req.header("token"));

    //pull the token from the request of the user
    // const jwtToken = req.header("token");
    // //if there is no token = not authorized
    // if (!jwtToken) {
    //   return res.status(403).json("Not Authorized");
    // }
    // const jwtSecret: Secret = <string>process.env.JWT_SECRET;

    // //check if the json token is valid rather than a fake one inputted by a user
    // const payload: any = jwt.verify(jwtToken, jwtSecret);

    req.user = decodedToken.uid; //gives us access to the user id
  } catch (error: any) {
    console.log("user error", error.message);
    return res.status(403).json("Not Authorized");
  }
  next(); //moves on
};
export default authorization;
