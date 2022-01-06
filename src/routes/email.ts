import { Router } from "express";
import { gmail_v1, google } from "googleapis";

import { URL } from "url";
import http from "http";
import opn from "open";
import destroyer from "server-destroy";
import authorization from "../middlewares/auth";
import { OAuth2Client } from "@grpc/grpc-js";
import { PrismaClient } from "@prisma/client";
require("dotenv").config();

const gmail = google.gmail("v1");
// const people = google.people("v1");
const prisma = new PrismaClient();

const emailRouter = Router();
//google apis
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_API;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

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
google.options({ auth: oAuth2Client });
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// const sendMail = async (
//   emailFrom: string,
//   emailTo: string,
//   subject: string,
//   message: string,
//   html: string | null
// ) => {
//   try {
//     const accessToken = await oAuth2Client.getAccessToken();
//     const transport = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAUTH2",
//         user: emailFrom,
//         clientId: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: accessToken,
//       },
//     } as SMTPTransport.Options);
//     const mailOptions = {
//       from: emailFrom,
//       to: emailTo,
//       subject: subject,
//       text: message,
//       html: html,
//     } as MailOptions;
//     const result = await transport.sendMail(mailOptions);
//     return result;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };
const getGoogleAuthUrl = async () => {
  return await oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes, // If you only need one scope you can pass it as string
  });
};

emailRouter.get("/integrate-gmail", authorization, async (req, res) => {
  try {
    const userId = req.user.toString();
    // redirect url send to frontend or open from backend updates to redirect uri are in package.json
    const url = await getGoogleAuthUrl();
    res.send({ success: true, message: null, data: url });
  } catch (error) {
    // throw new Error("something went wriong ");
    console.log(error);
    // res.send(error);
  }
});

emailRouter.post("/integrate-gmail-2", authorization, async (req, res) => {
  try {
    google.options({ auth: oAuth2Client });

    const userId = req.user.toString();
    const { code } = req.body;
    console.log("code", code);
    if (code) {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
      oAuth2Client.refreshAccessToken(function (err, tokens) {
        oAuth2Client.credentials = { access_token: tokens?.access_token };
      });
      console.log(oAuth2Client);

      const result = await google
        .gmail({ version: "v1", auth: oAuth2Client })
        .users.getProfile({ userId: `me` });

      await prisma.gmailIntegrationDetails.create({
        data: {
          email: result.data.emailAddress as string,
          integrated_user: userId,
        },
      });
      if (result) {
        res.send({ success: true, message: null, data: null });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

const getUserEmailFromGmailIntegration = async (userId: string) => {
  const data = await prisma.gmailIntegrationDetails.findFirst({
    where: { integrated_user: userId },
  });
  return data?.email;
};
emailRouter.get(
  "/check-integration-status",
  authorization,
  async (req, res) => {
    try {
      const userId = req.user.toString();
      const userGmail = await getUserEmailFromGmailIntegration(userId);
      // console.log("userGmail", userGmail);
      google.options({ auth: oAuth2Client });

      const result = await google
        .gmail({ version: "v1", auth: oAuth2Client })
        .users.getProfile({ userId: userGmail });
      console.log("result", result);
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

//send email
emailRouter.post("/send-email", async (req, res) => {
  try {
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
    console.log("message", messageParts);
    const message = messageParts.join("\n");
    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
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
//send email
emailRouter.post("/reply-to-message", async (req, res) => {
  try {
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
    console.log("message", messageParts);
    const message = messageParts.join("\n");
    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
      userId: "me",
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

// refresh the tokens automatically?
oAuth2Client.on("tokens", (tokens) => {
  if (tokens.refresh_token) {
    // store the refresh_token in my database!
    oAuth2Client.setCredentials({ refresh_token: tokens.refresh_token });
    // console.log(tokens.refresh_token);
  }
  // console.log(tokens.access_token);
});

const authenticate = async (scopes: any): Promise<OAuth2Client> => {
  return new Promise((resolve, reject) => {
    // grab the url that will be used for authorization
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes.join(" "),
    });

    const server = http
      .createServer(async (req: any, res) => {
        try {
          // if (req.url.indexOf("/oauth2callback") > -1) {
          const qs = new URL(req.url, "http://localhost:3000/email")
            .searchParams;
          res.end("Authentication successful! Please return to the console.");
          server.destroy();
          const code = qs.get("code");
          if (!code) return;
          const { tokens } = await oAuth2Client.getToken(code);

          oAuth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates

          resolve(oAuth2Client);
          // }
        } catch (e) {
          reject(e);
        }
      })
      .listen(5555, () => {
        // open the browser to the authorize url to start the workflow
        opn(authorizeUrl, { wait: false }).then((cp) => cp.unref());
      });
    destroyer(server);
  });
};
// const authenticate = async (scopes: any): Promise<OAuth2Client> => {
//   return new Promise((resolve, reject) => {
//     // grab the url that will be used for authorization
//     const authorizeUrl = oAuth2Client.generateAuthUrl({
//       access_type: "offline",
//       scope: scopes.join(" "),
//     });

//     const server = http
//       .createServer(async (req: any, res) => {
//         try {
//           // if (req.url.indexOf("/oauth2callback") > -1) {
//           const qs = new URL(req.url, "http://localhost:3000/email")
//             .searchParams;
//           res.end("Authentication successful! Please return to the console.");

//           server.destroy();
//           const code = qs.get("code");
//           if (!code) return;
//           const { tokens } = await oAuth2Client.getToken(code);

//           console.log("tokens", tokens);
//           oAuth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
//           // oAuth2Client.refreshAccessToken(function (err, tokens) {
//           //   // console.log("tokens", tokens);
//           //   oAuth2Client.credentials = { access_token: tokens?.access_token };
//           // });
//           resolve(oAuth2Client);
//           // }
//         } catch (e) {
//           console.log(e);
//           reject(e);
//         }
//       })
//       .listen(5555, () => {
//         // open the browser to the authorize url to start the workflow
//         opn(authorizeUrl, { wait: false }).then((cp) => cp.unref());
//       });
//     destroyer(server);
//   });
// };

const listLabels = async () => {
  google.options({ auth: oAuth2Client });

  const { data } = await gmail.users.labels.list({
    userId: `me`,
  });

  return data;
};
emailRouter.get("/fetch-labels", async (req, res) => {
  try {
    const data = await listLabels();
    res.send({ success: true, message: "Successfully fetched labels", data });
  } catch (error) {
    console.log(error);
  }
});

//get thread
emailRouter.get("/fetch-threads", async (req, res) => {
  try {
    google.options({ auth: oAuth2Client });
    const { data } = await gmail.users.threads.list({
      userId: `me`,
    });
    res.send({ success: true, message: "Successfully fetched threads", data });
  } catch (error) {
    console.log(error);
  }
});
//get thread
emailRouter.get("/fetch-specific-thread/:emailQuery", async (req, res) => {
  try {
    const emailQuery = req.params.emailQuery;
    google.options({ auth: oAuth2Client });
    const { data } = await gmail.users.threads.list({
      userId: `me`,
      q: emailQuery,
    });
    res.send({ success: true, message: "Successfully fetched threads", data });
  } catch (error) {
    console.log(error);
  }
});

const decodeMessage = (message: string) => {
  const decodedBody = Buffer.from(message, "base64").toString("binary");
  return decodedBody;
};
//list specific message
emailRouter.get("/fetch-specific-message/:messageId", async (req, res) => {
  try {
    const messageId = req.params.messageId;
    google.options({ auth: oAuth2Client });
    const { data } = await gmail.users.messages.get({
      userId: `me`,
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
        emailRecieved: data.payload.headers.find((h) => h.name === "Received"),
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
        emailRecieved: data.payload.headers.find((h) => h.name === "Received"),
        emailDate: data.payload.headers.find((h) => h.name === "Date"),
        messageId: data.payload.headers.find((h) => h.name === "Message-Id"),
        emailBody: decodedBody,
      };
      res.send(email);
    }
  } catch (error) {
    console.log(error);
  }
});

const listMessageIds = async (userId: string) => {
  google.options({ auth: oAuth2Client });

  const { data } = await gmail.users.messages.list({
    userId,
    maxResults: 25,
    labelIds: ["INBOX"],
  });

  return data.messages;
};

//RELABEL TO fetch-inbox
emailRouter.get("/fetch-messages", authorization, async (req, res) => {
  try {
    const userId = req.user.toString();
    const email = await getUserEmailFromGmailIntegration(userId);
    if (!email) return;
    if (!userId)
      return res.send({
        success: false,
        message: "You are not authorized",
        data: null,
      });
    google.options({ auth: oAuth2Client });
    const messageIdList = await listMessageIds(email);
    const list: gmail_v1.Schema$Message[] = [];
    if (!messageIdList) return;
    for (const message of messageIdList) {
      if (message.id) {
        const { data } = await gmail.users.messages.get({
          userId: email,
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
emailRouter.get("/fetch-sent-messages", async (req, res) => {
  try {
    // const userId = req.user;
    // if (!userId)
    //   return res.send({
    //     success: false,
    //     message: "You are not authorized",
    //     data: null,
    //   });
    google.options({ auth: oAuth2Client });
    const { data } = await gmail.users.messages.list({
      userId: `me`,
      maxResults: 100,
      labelIds: ["SENT"],
    });

    const list: gmail_v1.Schema$Message[] = [];
    if (!data.messages) return;
    for (const message of data.messages) {
      if (message.id) {
        const { data } = await gmail.users.messages.get({
          userId: `me`,
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

export default emailRouter;
