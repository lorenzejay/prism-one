import { Industry, PrismaClient } from ".prisma/client";
import { Router } from "express";
import * as admin from "firebase-admin";
import authorization from "../middlewares/auth";
import { generateUserToken } from "../utils/jwtGenerator";
const userRouter = Router();

const prisma = new PrismaClient();

userRouter.post("/register", async (req, res) => {
  try {
    const { email, username, first_name, last_name, password } = req.body;
    // return res.send(JSON.stringify(phone_number));
    const createdUser = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });
    // console.log("createdUser", createdUser);

    const { uid } = createdUser;
    await prisma.user.create({
      data: {
        email,
        id: uid,
        first_name,
        last_name,
      },
    });
    const token = await generateUserToken(uid);

    //uid is the userId of the registered user
    res.status(200).send({
      success: true,
      message: "Successfully created a user.",

      id: uid,
    });
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
    const decodedToken = await admin.auth().verifyIdToken(userToken);
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
    console.log("userId", userId);
    const userRecord = await admin.auth().getUser(userId.toString());
    if (!userRecord) return;
    const username = userRecord.displayName;
    console.log(username);
    res.send({ username });
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

export default userRouter;
