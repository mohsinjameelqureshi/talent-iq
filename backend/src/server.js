import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ msg: "success from backend api" });
});

connectDB()
  .then(() => {
    app.listen(ENV.PORT, () => {
      console.log(`server is running on port ${ENV.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
  });
