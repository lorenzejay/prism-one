import express from "express";
import cors from "cors";
import * as admin from "firebase-admin";
import userRouter from "./routes/user";
import projectRouter from "./routes/project";
import clientRouter from "./routes/clients";
import contractRouter from "./routes/contracts";
import cloudinary from "cloudinary";
import taskRouter from "./routes/tasks";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import emailRouter from "./routes/email";

const cldy = cloudinary.v2;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));

cldy.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

//routes
app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/clients", clientRouter);
app.use("/api/contracts", contractRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/emails", emailRouter);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/out/")));

//   app.get("*", (_, res) => {
//     res.sendFile(path.resolve(__dirname, "../client/out/index.html"));
//   });
// } else {
//   app.get("/", (_, res: Response) => {
//     res.send("Server Started");
//   });
// }
app.get("/", (_, res) => {
  res.send("Server Started");
});
app.listen(port, () => console.log(`Server started on port ${port}`));
