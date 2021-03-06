import { Router } from "express";
import { gmail_v1, google } from "googleapis";
import authorization from "../middlewares/auth";
import { PrismaClient } from "@prisma/client";
require("dotenv").config();

const gmail = google.gmail("v1");
const googleAuthRouter = Router();
const prisma = new PrismaClient();

//google apis
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_API;

const scopes = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const url = oAuth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: "offline",

  // If you only need one scope you can pass it as a string
  scope: scopes,
  prompt: "consent",
});

googleAuthRouter.get("/get-auth-url", async (req, res) => {
  try {
    res.send(url);
  } catch (error) {
    console.log(error);
  }
});

googleAuthRouter.post(
  "/integrate-gmail-final",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user.toString();
      const { code } = req.body;

      if (!code || !userId) return;
      const { tokens } = await oAuth2Client.getToken(code);
      await oAuth2Client.setCredentials(tokens);
      google.options({ auth: oAuth2Client });
      const response = await gmail.users.getProfile({
        // The user's email address. The special value `me` can be used to indicate the authenticated user.
        userId: `me`,
      });
      if (!response) return;

      if (tokens.refresh_token) {
        await prisma.gmailIntegrationRefreshTokens.create({
          data: {
            refresh_token: tokens.refresh_token,
            integrated_user: userId,
            email: response.data.emailAddress as string,
          },
        });
      }

      res.send({ success: true, message: "", data: response });
    } catch (error) {
      // throw new Error(
      //   "Error: No access, refresh token, API key or refresh handler callback is set."
      // ); if (response) {
      res.send({ success: false, message: "", data: error });
      // console.log(error);
    }
  }
);

googleAuthRouter.get(
  "/check-integration-status",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user.toString();

      const integratedUser =
        await prisma.gmailIntegrationRefreshTokens.findFirst({
          where: { integrated_user: userId },
          select: {
            refresh_token: true,
            email: true,
            id: true,
          },
        });
      // console.log("integratedUser", integratedUser);
      if (integratedUser) {
        oAuth2Client.credentials = {
          refresh_token: integratedUser.refresh_token,
        };
      }
      //if new refresh is added store it ? this rarely triggers so possible delete later on -> need to test still
      oAuth2Client.on("tokens", (tokens) => {
        if (tokens.refresh_token) {
          // store the refresh_token in my database!
          prisma.gmailIntegrationRefreshTokens.update({
            where: { id: integratedUser?.id },
            data: {
              refresh_token: tokens.refresh_token,
            },
          });
        }
      });

      google.options({ auth: oAuth2Client });
      const result = await gmail.users.getProfile({
        // The user's email address. The special value `me` can be used to indicate the authenticated user.
        userId: integratedUser?.email,
      });
      if (result) {
        return res.send({
          success: true,
          message: `You have logged in as ${result.data.emailAddress}`,
          data: result.data.emailAddress,
        });
      }
      res.send({
        success: false,
        message: "You are not integrated",
        data: false,
      });
    } catch (error) {
      // console.log(error);
      res.send({
        success: false,
        message: "You are not integrated",
        data: false,
      });
      // throw new Error("integration went wrong");
    }
  }
);

const listMessageIds = async (integratedGmail: string) => {
  const { data } = await gmail.users.messages.list({
    userId: integratedGmail,
    maxResults: 25,
    labelIds: ["INBOX"],
  });

  return data.messages;
};

googleAuthRouter.get("/fetch-messages", authorization, async (req, res) => {
  try {
    const userId = req.user.toString();
    //   const email = await getUserEmailFromGmailIntegration(userId);

    if (!userId)
      return res.send({
        success: false,
        message: "You are not authorized",
        data: null,
      });
    google.options({ auth: oAuth2Client });
    const integratedGmail =
      await prisma.gmailIntegrationRefreshTokens.findFirst({
        where: { integrated_user: userId },
        select: {
          email: true,
        },
      });
    if (!integratedGmail) return;
    const messageIdList = await listMessageIds(integratedGmail.email);
    const list: gmail_v1.Schema$Message[] = [];
    if (!messageIdList) return;
    for (const message of messageIdList) {
      if (message.id) {
        const { data } = await gmail.users.messages.get({
          userId: integratedGmail.email,
          id: message.id,
        });
        list.push(data);
      }
    }

    res.send({ success: true, message: null, data: list });
  } catch (error) {
    console.log(error);
  }
});

googleAuthRouter.get(
  "/fetch-sent-messages",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user;
      if (!userId)
        return res.send({
          success: false,
          message: "You are not authorized b",
          data: null,
        });

      const integratedGmail =
        await prisma.gmailIntegrationRefreshTokens.findFirst({
          where: { integrated_user: userId },
          select: {
            email: true,
          },
        });
      if (!integratedGmail)
        return res.send({
          success: false,
          message: "You are not authorized",
          data: null,
        });
      google.options({ auth: oAuth2Client });
      const { data } = await gmail.users.messages.list({
        userId: integratedGmail.email,
        maxResults: 25,
        labelIds: ["SENT"],
      });

      const list: gmail_v1.Schema$Message[] = [];
      if (!data.messages) return;
      for (const message of data.messages) {
        if (message.id) {
          const { data } = await gmail.users.messages.get({
            userId: integratedGmail.email,
            id: message.id,
          });
          list.push(data);
        }
      }

      res.send({ success: true, message: null, data: list });
    } catch (error) {
      console.log(error);
      // throw Error("Something went wrong bb");
    }
  }
);

//send email
googleAuthRouter.post("/send-email", authorization, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId)
      return res.send({
        success: false,
        message: "You are not authorized b",
        data: null,
      });
    const integratedGmail =
      await prisma.gmailIntegrationRefreshTokens.findFirst({
        where: { integrated_user: userId },
        select: {
          email: true,
        },
      });
    if (!integratedGmail)
      return res.send({
        success: false,
        message: "You are not authorized",
        data: null,
      });
    google.options({ auth: oAuth2Client });
    const { subject, from, to, body } = req.body;
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString(
      "base64"
    )}?=`;
    const messageParts = [
      `From: <${from}>`,
      `To: <${to}>`,
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${utf8Subject}`,
      "",
      body,
    ];

    const message = messageParts.join("\n");
    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
      userId: integratedGmail.email,
      requestBody: {
        raw: encodedMessage,
      },
    });

    //return the thread id so it can be followed
    res.send({
      success: true,
      message: "Successfully sent the email",
      data: response.data.threadId,
    });
  } catch (error) {
    console.log(error);
  }
});
//send email
googleAuthRouter.post("/reply-to-message", authorization, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId)
      return res.send({
        success: false,
        message: "You are not authorized b",
        data: null,
      });
    const integratedGmail =
      await prisma.gmailIntegrationRefreshTokens.findFirst({
        where: { integrated_user: userId },
        select: {
          email: true,
        },
      });
    if (!integratedGmail?.email)
      return res.send({
        success: false,
        message: "You are not authorized",
        data: null,
      });
    google.options({ auth: oAuth2Client });
    const { subject, from, to, body, threadId, messageId } = req.body;
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString(
      "base64"
    )}?=`;

    const messageParts = [
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      "Content-Transfer-Encoding: 7bit",
      `References: ${messageId}`,
      `In-Reply-To":${messageId}`,
      `Subject: Re: ${utf8Subject}`,
      `From: ${from}`,
      `To: ${to}`,
      "",
      body,
    ];
    // console.log("message", messageParts);
    const message = messageParts.join("\n");
    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
      userId: integratedGmail.email,
      requestBody: {
        raw: encodedMessage,
        threadId: threadId,
      },
    });

    res.send({
      success: true,
      message: "Successfully sent the email",
      data: response,
    });
  } catch (error) {
    console.log(error);
  }
});
const decodeMessage = (message: string) => {
  const decodedBody = Buffer.from(message, "base64").toString("binary");
  return decodedBody;
};
//list specific message
googleAuthRouter.get(
  "/fetch-specific-message/:messageId",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user;
      if (!userId)
        return res.send({
          success: false,
          message: "You are not authorized b",
          data: null,
        });
      const integratedGmail =
        await prisma.gmailIntegrationRefreshTokens.findFirst({
          where: { integrated_user: userId },
          select: {
            email: true,
          },
        });
      if (!integratedGmail)
        return res.send({
          success: false,
          message: "You are not authorized",
          data: null,
        });
      google.options({ auth: oAuth2Client });
      const messageId = req.params.messageId;

      const { data } = await gmail.users.messages.get({
        userId: integratedGmail.email,
        id: messageId,
      });
      if (!data.payload) return;
      if (!data.payload.headers) return;
      //need to look at the mime-type
      const mimeType = data.payload.mimeType;

      if (mimeType !== "multipart/alternative") {
        // console.log("passed", data.payload);

        //decode the email
        if (!data.payload.body) return;
        if (!data.payload.body.data) return;
        const decodedBody = decodeMessage(data.payload.body.data);

        const email = {
          emailId: data.id,
          emailThreadId: data.threadId,
          labelIds: data.labelIds,
          emailFrom: data.payload.headers.find((h) => h.name === "From"),
          emailTo: data.payload.headers.find((h) => h.name === "To"),
          emailSubject: data.payload.headers.find((h) => h.name === "Subject"),
          emailRecieved: data.payload.headers.find(
            (h) => h.name === "Received"
          ),
          emailDate: data.payload.headers.find((h) => h.name === "Date"),
          messageId: data.payload.headers.find((h) => h.name === "Message-Id"),
          emailBody: decodedBody,
        };

        res.send(email);
      } else {
        //find the part to get to text/html so we can output that
        const emailBody = data.payload.parts?.find(
          (part) => part.mimeType === "text/html"
        );
        if (!emailBody) return;
        if (!emailBody.body) return;
        if (!emailBody.body.data) return;

        //emailBody?.body?.data
        const decodedBody = decodeMessage(emailBody?.body?.data);

        const email = {
          emailId: data.id,
          emailThreadId: data.threadId,
          labelIds: data.labelIds,
          emailFrom: data.payload.headers.find((h) => h.name === "From"),
          emailTo: data.payload.headers.find((h) => h.name === "To"),
          emailSubject: data.payload.headers.find((h) => h.name === "Subject"),
          emailRecieved: data.payload.headers.find(
            (h) => h.name === "Received"
          ),
          emailDate: data.payload.headers.find((h) => h.name === "Date"),
          messageId: data.payload.headers.find((h) => h.name === "Message-Id"),
          emailBody: decodedBody,
        };
        res.send(email);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

//set threadId to database
googleAuthRouter.post(
  "/save-threadId/:projectId",
  authorization,
  async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const { threadId } = req.body;
      const userId = req.user;
      const integratedGmail =
        await prisma.gmailIntegrationRefreshTokens.findFirst({
          where: { integrated_user: userId },
          select: {
            email: true,
          },
        });
      if (!integratedGmail)
        return res.send({
          success: false,
          message: "You are not authorized",
          data: null,
        });
      google.options({ auth: oAuth2Client });
      await prisma.threadIds.create({
        data: {
          threadId,
          project_associated: projectId,
        },
      });
      res.send({
        success: true,
        message: "Successfully fetched thread",
        data: null,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//fetch thread
//check to enable authorization (maybe not needed for now)
googleAuthRouter.get(
  "/get-threadId/:projectId",
  authorization,
  async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      // console.log("porjectid", projectId);
      const userId = req.user.toString();
      //fetch the threadId

      const threadData = await prisma.threadIds.findFirst({
        where: {
          project_associated: projectId,
        },
        select: {
          threadId: true,
        },
      });
      // console.log("threadData", threadData);
      if (threadData) {
        const integratedGmail =
          await prisma.gmailIntegrationRefreshTokens.findFirst({
            where: { integrated_user: userId },
            select: {
              email: true,
              refresh_token: true,
            },
          });
        if (!integratedGmail)
          return res.status(400).send({
            success: false,
            message: "You are not authorized",
            data: null,
          });

        await oAuth2Client.setCredentials({
          refresh_token: integratedGmail.refresh_token,
        });
        google.options({ auth: oAuth2Client });
        const threads = await gmail.users.threads.get({
          id: threadData.threadId,
          userId: integratedGmail.email,
        });
        // console.log("threads", threads?.data?.messages[0]?.id);
        if (!threads.data.messages) return;
        let messages: any[] = [];

        // console.log("threads.data.messages", threads);
        await threads.data.messages.map((message) => {
          // console.log("message-type", message.payload?.headers);
          if (message.payload?.mimeType !== "multipart/alternative") {
            // if (!message.id) return;
            // if (!message.payload?.body) return;
            // if (!message.payload?.body.data) return;
            const decodedBody = decodeMessage(
              message.payload?.body?.data as string
            );
            const email = {
              emailId: message.id,
              emailThreadId: message.threadId,
              labelIds: message.labelIds,
              emailFrom: message.payload?.headers?.find(
                (h) => h.name === "From"
              ),
              emailTo: message.payload?.headers?.find((h) => h.name === "To"),
              emailSubject: message.payload?.headers?.find(
                (h) => h.name === "Subject"
              ),
              emailRecieved: message.payload?.headers?.find(
                (h) => h.name === "Received"
              ),
              emailDate: message.payload?.headers?.find(
                (h) => h.name === "Date"
              ),
              messageId: message.payload?.headers?.find(
                (h) => h.name === ("Message-ID" || "Message-Id")
              ),
              inReplyTo: message.payload?.headers?.find(
                (h) => h.name === "In-Reply-To"
              ),
              emailBody: decodedBody,
              contentType: message.payload?.headers?.find(
                (h) => h.name === "Content-Type"
              ),
            };
            // console.log("email1", email);
            messages.push(email);
          } else {
            //find the part to get to text/html so we can output that
            const emailBody = message.payload.parts?.find(
              (part) => part.mimeType === "text/html"
            );
            if (!emailBody) return;
            if (!emailBody.body) return;
            if (!emailBody.body.data) return;

            //emailBody?.body?.data
            const decodedBody = decodeMessage(emailBody?.body?.data);

            const email = {
              emailId: message.id,
              emailThreadId: message.threadId,
              labelIds: message.labelIds,
              emailTo: message.payload.headers?.find((h) => h.name === "To"),
              emailFrom: message.payload.headers?.find(
                (h) => h.name === "From"
              ),
              emailSubject: message.payload.headers?.find(
                (h) => h.name === "Subject"
              ),
              emailRecieved: message.payload.headers?.find(
                (h) => h.name === "Received"
              ),
              emailDate: message.payload.headers?.find(
                (h) => h.name === "Date"
              ),
              messageId: message.payload.headers?.find(
                (h) => h.name === ("Message-ID" || "Message-Id")
              ),
              emailBody: decodedBody,
              inReplyTo: message.payload?.headers?.find(
                (h) => h.name === "In-Reply-To"
              ),
              contentType: message.payload?.headers?.find(
                (h) => h.name === "Content-Type"
              ),
            };
            // console.log("email2", email);
            messages.push(email);
          }
          // console.log("messages", messages);
        });
        // console.log("messages", messages);
        return res.send({
          success: true,
          message: "Successfully fetched thread",
          data: messages,
        });
      } else {
        res.send({
          success: false,
          message: "No Thread",
          data: null,
        });
      }
    } catch (error) {
      console.log(error);
      // res.send({
      //   success: false,
      //   message: "No Thread",
      //   data: null,
      // });
    }
  }
);

//fetch my gmail
googleAuthRouter.get(
  "/fetch-my-email-string",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user;
      const data = await prisma.gmailIntegrationRefreshTokens.findFirst({
        where: {
          integrated_user: userId,
        },
        select: {
          email: true,
        },
      });
      if (data?.email) {
        res.send({ success: true, message: null, data: data.email });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default googleAuthRouter;
