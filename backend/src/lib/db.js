import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(ENV.db_url);
    console.log(`\n MongoDb Connected! DB host:${con.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection error", error);
    process.exit(1);
  }
};
