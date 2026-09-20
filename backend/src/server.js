import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";

const app = express();

//middlewares
app.use(express.json());

// this means server allow browser to include cookies on every request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use("/api/inngest", serve({ client: inngest, functions }));

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
