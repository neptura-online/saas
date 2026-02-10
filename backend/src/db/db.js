import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const url = process.env.DB_URL;
    await mongoose.connect(url);
    console.log("database connected successfull");
  } catch (error) {
    console.log("database not connected", error);
  }
};
