import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// const mongoDBUrl = process.env.MONGODB_URL;
const mongoDBUrl = "mongodb+srv://PingAdminX0X0:pingadminxoxo@ping.cuj9q.mongodb.net/MemoRise?retryWrites=true&w=majority&appName=Ping";

export async function connectDB() {
  try {
    mongoose.connect(mongoDBUrl);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    connection.on("error", (error) => {
      console.log("MongoDB connection failed", error);
      process.exit(1);
    });
  } catch (error) {
    console.log("MongoDB connection failed", error);
  }
}