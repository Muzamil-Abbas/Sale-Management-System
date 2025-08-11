import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongoose is connected");
  } catch (error) {
    console.log("mongoDB connection error :" + error);
    throw error; // so that server startup fails if DB connection fails
  }
};

export default connectDB;
