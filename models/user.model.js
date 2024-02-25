import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    products: [
      {
        productId: String,
      },
    ],
  },
  { timestamps: true },
);

//fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
