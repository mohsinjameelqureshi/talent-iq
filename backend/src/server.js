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
import logger from "./logger.js";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";
import chatRoutes from "./routes/chatRoutes.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Basic middleware

app.use(express.json());

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  }),
);

// Logging

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const [method, url, status, responseTime] = message.trim().split(" ");

        logger.info(
          JSON.stringify({
            method,
            url,
            status,
            responseTime,
          }),
        );
      },
    },
  }),
);

// Clerk

app.use(clerkMiddleware());

// Inngest

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  }),
);

app.use("/api/chat", chatRoutes);

// Health check

app.get("/health", (req, res) => {
  res.status(200).json({
    msg: "API is up and running",
  });
});

// Production frontend

if (ENV.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendDistPath));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// Start server

connectDB()
  .then(() => {
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
