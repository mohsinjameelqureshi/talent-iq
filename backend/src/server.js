import express from "express";
import dotenv from "dotenv";
import { ENV } from "./lib/env.js";

dotenv.config;

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ msg: "success from backend api" });
});

app.listen(ENV.PORT, () => {
  console.log("server is running on port 3000");
});
