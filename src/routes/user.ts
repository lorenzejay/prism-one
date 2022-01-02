import { Industry, PrismaClient } from ".prisma/client";
import { Router } from "express";
import fetch from "node-fetch";
import authorization from "../middlewares/auth";
import { auth } from "../utils/firebaseInit";
const userRouter = Router();

const prisma = new PrismaClient();

userRouter.post("/register", async (req, res, next) => {
  try {
    const { email, username, first_name, last_name, password } = req.body;
    // return res.send(JSON.stringify(phone_number));
    const createdUser = await auth.createUser({
      email,
      password,
      displayName: username,
    });

    const { uid } = createdUser;
    await prisma.user.create({
      data: {
        email,
        id: uid,
        first_name,
        last_name,
      },
    });
    //create a return object for new user
    //uid is the userId of the registered user
    res.status(200).send({
      success: true,
      message: "Successfully created a user.",

      data: uid,
    });
  } catch (error: any) {
    console.log(error);
    res.send({
      data: error,
      message: error.errorInfo.message,
      success: false,
    });
  }
});

userRouter.get("/refetch-user-token/:refresh_token", async (req, res) => {
  try {
    const refreshToken = req.params.refresh_token;
    const FB_API_KEY = process.env.FIREBASE_WEB_API_KEY;
    const config = {
      method: "post",
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=[${FB_API_KEY}]`,
      config
    );

    res.send(response.json());
  } catch (error) {
    console.log(error);
  }
});

userRouter.post("/register-company", authorization, async (req, res) => {
  try {
    const {
      industry,
      company_name,
      company_email,
    }: { industry: Industry; company_name: string; company_email: string } =
      req.body;
    const userId = req.user;
    const user = userId.toString();
    console.log("userId", userId);

    await prisma.companyDetails.create({
      data: {
        owner_id: user,
        company_name,
        company_email,
        industry,
      },
    });
    res.send({ success: true, message: "Completed Profile" });
  } catch (error) {
    console.log(error);
  }
});

//sign in requires the frontend to send a token and we verify it in the backend here
userRouter.get("/get-user-id/:userToken", async (req, res) => {
  try {
    const { userToken } = req.params;
    //verify the token with firebase
    const decodedToken = await auth.verifyIdToken(userToken);
    const uid = decodedToken.uid;
    res.send({ userId: uid });
  } catch (error) {
    console.log(error);
  }
});

userRouter.get("/get-username", authorization, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) return;
    const userRecord = await auth.getUser(userId.toString());
    if (!userRecord) return;
    const username = userRecord.displayName;

    res.send(username);
  } catch (error) {
    console.log(error);
  }
});
userRouter.get("/get-firstname", authorization, async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) return;
    const user = await prisma.user.findUnique({
      where: {
        id: userId.toString(),
      },
    });
    if (!user)
      return res.send({
        success: false,
        message: "unable to find user",
        data: undefined,
      });

    res.send({ success: true, message: undefined, data: user.first_name });
  } catch (error) {
    console.log(error);
  }
});

userRouter.get(
  "/user-credential-details/:uid",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user.toString();
      const uid = req.params.uid;
      const token = req.header("token");
      if (userId == uid) {
        const user = await auth.getUser(uid);

        res.send({ uid: user.uid, token });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default userRouter;
