import dotenv from "dotenv";
import { app } from "./app.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

//database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL).then((data) => {
      console.log(`Connection success with ${data.connection.host}`);
    });
  } catch (error) {
    console.log(error.message);
    setTimeout(connectDB, 500);
  }
};

// start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
});
