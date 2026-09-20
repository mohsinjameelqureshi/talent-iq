import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const con = await mongoose.connect(ENV.db_url);

    console.log(`MongoDB Connected! DB host: ${con.connection.host}`);

    return con;
  } catch (error) {
    console.error("MongoDB Connection error:", error);
    throw error;
  }
};
