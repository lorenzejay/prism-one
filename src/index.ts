import express from "express";
import cors from "cors";
import userRouter from "./routes/user";
import projectRouter from "./routes/project";
import clientRouter from "./routes/clients";
import contractRouter from "./routes/contracts";
import taskRouter from "./routes/tasks";
import emailRouter from "./routes/email";
import galleryRouter from "./routes/gallery";
import path from "path";
import leadRouter from "./routes/leads";

require("dotenv").config();

// const cldy = cloudinary.v2;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "20mb", extended: true }));

//routes
app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/clients", clientRouter);
app.use("/api/contracts", contractRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/emails", emailRouter);
app.use("/api/galleries", galleryRouter);
app.use("/api/leads", leadRouter);

if (process.env.NODE_ENV === "production") {
  //list out all the routes specifically

  app.use(express.static(path.join(__dirname, "../client/out")));
  //dynamic routes
  app.get("/projects/:projectId", (_, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client/out/projects/[projectId].html")
    );
  });
  app.get("/clients/create", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/clients/create.html"));
  });
  app.get("/clients/:clientId", (_, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client/out/clients/[clientId].html")
    );
  });
  app.get("/clients/upload", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/clients/create.html"));
  });
  app.get("/contracts/upload", (_, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client/out/contracts/upload.html")
    );
  });
  app.get("/contracts/:contractId", (_, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client/out/contracts/[contractId].html")
    );
  });
  app.get("/email/create", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/email/create.html"));
  });
  app.get("/email/inbox", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/email/inbox.html"));
  });
  app.get("/email/sent", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/email/sent.html"));
  });
  app.get("/email/view/:messageId", (_, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client/out/email/view/[messageId].html")
    );
  });
  app.get("/leads/view/:leadId", (_, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client/out/leads/view/[leadId].html")
    );
  });
  app.get("/leads/:leadId", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/leads/[leadId].html"));
  });
  app.get("/leads/create", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/leads/create.html"));
  });

  app.get("/projects/create", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/projects/create.html"));
  });
  app.get("/projects/:projectId", (_, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client/out/projects/[projectId].html")
    );
  });
  app.get("/register/company", (_, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client/out/register/company.html")
    );
  });
  app.get("/tasks/:taskId", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/tasks/[taskId].html"));
  });
  app.get("/tasks/create", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/tasks/create.html"));
  });
  app.get("/clients", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/clients.html"));
  });
  app.get("/contracts", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/contracts.html"));
  });
  app.get("/email", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/email.html"));
  });
  app.get("/galleries", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/galleries.html"));
  });
  app.get("/goals", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/goals.html"));
  });
  app.get("/home", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/home.html"));
  });
  app.get("/leads", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/leads.html"));
  });
  app.get("/projects", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/projects.html"));
  });
  app.get("/register", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/register.html"));
  });
  app.get("/sign-in", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/sign-in.html"));
  });
  app.get("/tasks", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/tasks.html"));
  });

  app.get("/", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out", "index.html"));
  });
  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out", "404.html"));
  });
} else {
  app.get("/", (_, res) => {
    res.send("Server Started");
  });
}
// app.get("/", (_, res) => {
//   res.send("Server Started");
// });
app.listen(port, () => console.log(`Server started on port ${port}`));
