import express from "express";
import cors from "cors";

import router from "./routes/userRoutes.js";
import tripRouter from "./routes/tripRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

import {executeGlobalSearch} from './controllers/searchController.js'

const app = express();

app.use(
  cors({
    origin: "https://tripify-web.netlify.app/",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", router);
app.use("/api/trips", tripRouter);
app.use("/api/comments", commentRouter);
app.use("/api/messages", messageRouter);
app.use("/api/search",executeGlobalSearch)

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tripify Backend is Running",
  });
});

export default app;