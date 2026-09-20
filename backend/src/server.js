import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middlewares
app.use(express.json());

// this means server allow browser to include cookies on every request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

if (ENV.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../../frontend/dist");

  app.use(express.static(frontendDistPath));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

connectDB()
  .then(() => {
    app.listen(ENV.PORT, () => {
      console.log(`server is running on port ${ENV.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
  });
