import { Request, Router } from "express";
import fs from "fs";
import readline from "readline";
import { gmail_v1, google } from "googleapis";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { MailOptions } from "nodemailer/lib/json-transport";
import { URL } from "url";
import http from "http";
import opn from "open";
import destroyer from "server-destroy";
import authorization from "../middlewares/auth";
import { OAuth2Client } from "google-auth-library";
import { MessageChannel } from "worker_threads";

const gmail = google.gmail("v1");
const people = google.people("v1");

const emailRouter = Router();
//google apis
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_API;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const scopes = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.labels",
];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function runSample(client: any) {
  // retrieve user profile
  console.log("client", client);
  console.log("hello world");
  const res = await people.people.get({
    resourceName: "people/me",
    personFields: "emailAddresses",
  });
  console.log(res.data);
}

const sendMail = async (
  emailFrom: string,
  emailTo: string,
  subject: string,
  message: string,
  html: string | null
) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAUTH2",
        user: emailFrom,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    } as SMTPTransport.Options);
    const mailOptions = {
      from: emailFrom,
      to: emailTo,
      subject: subject,
      text: message,
      html: html,
    } as MailOptions;
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

emailRouter.get("/integrate-gmail", async (req, res) => {
  try {
    const url = oAuth2Client.generateAuthUrl({
      scope: scopes,
    });

    //redirect url send to frontend or open from backend updates to redirect uri are in package.json
    res.send(url);
    await authenticate(scopes);
    const result = await google
      .gmail({ version: "v1", auth: oAuth2Client })
      .users.getProfile({ userId: `me` });
    res.send({ success: true, message: "Authenticated", data: result });
    // console.log(url);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

//logout
emailRouter.post(
  `admin.googleapis.com/admin/directory/v1/users/me/signOut`,
  async (req, res) => {
    res.send("logged out");
  }
);

emailRouter.get("/check-integration-status", async (_, res) => {
  try {
    const result = await google
      .gmail({ version: "v1", auth: oAuth2Client })
      .users.getProfile({ userId: `me` });
    console.log("result", result);
    if (result) {
      return res.send({
        success: true,
        message: "You have integrated your gmail account",
        data: true,
      });
    }
    res.send({
      success: false,
      message: "You are not integrated",
      data: false,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
emailRouter.post("/generate-credential", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) return;
    const { tokens } = await oAuth2Client.getToken(code);
    console.log(tokens);
    await oAuth2Client.setCredentials(tokens);
    console.log("oAuth2Client.credentials", oAuth2Client.credentials);
    res.send({ credentials: oAuth2Client.credentials });
  } catch (error) {
    console.log(error);
  }
});
const authenticate = async (scopes: any) => {
  return new Promise((resolve, reject) => {
    // grab the url that will be used for authorization
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      scope: scopes.join(" "),
    });
    console.log(authorizeUrl);

    const server = http
      .createServer(async (req: any, res) => {
        try {
          // console.log(req.url.indexOf("/"))

          const qs = new URL(req.url, "http://localhost:3000/email")
            .searchParams;
          res.end("Authentication successful! Please return to the console.");
          server.destroy();
          const code = qs.get("code");
          if (!code) return;
          const { tokens } = await oAuth2Client.getToken(code);

          oAuth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
          resolve(oAuth2Client);
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

const listMessageIds = async () => {
  google.options({ auth: oAuth2Client });

  const { data } = await gmail.users.messages.list({
    userId: `me`,
    maxResults: 100,
  });
  console.log("data", data);
  return data.messages;
};
const listLabelIds = async () => {
  google.options({ auth: oAuth2Client });

  const { data } = await gmail.users.labels.list({});
  console.log("data", data);
  return data.labels;
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

    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

emailRouter.get("/fetch-messages", authorization, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId)
      return res.send({
        success: false,
        message: "You are not authorized",
        data: null,
      });
    google.options({ auth: oAuth2Client });
    const messageIdList = await listMessageIds();
    const list: gmail_v1.Schema$Message[] = [];
    if (!messageIdList) return;
    for (const message of messageIdList) {
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

// /**
//  * Lists the labels in the user's account.
//  *
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// function listLabels(auth: any | null) {
//   const gmail = google.gmail({ version: "v1", auth });
//   gmail.users.labels.list(
//     {
//       userId: "me",
//     },
//     (err, res) => {
//       if (err) return console.log("The API returned an error: " + err);
//       if (!res) return;
//       const labels = res.data.labels;
//       if (!labels) return;
//       if (labels.length) {
//         console.log("Labels:");
//         labels.forEach((label) => {
//           console.log(`- ${label.name}`);
//         });
//       } else {
//         console.log("No labels found.");
//       }
//     }
//   );
// }

export default emailRouter;
