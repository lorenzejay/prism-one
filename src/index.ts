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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/out/")));

  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/index.html"));
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
