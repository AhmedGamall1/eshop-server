import dotenv from "dotenv";
import userModel from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
dotenv.config();

//function that return token  [fix date before production]
const createToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3d", //3 days
  });

  const accessTokenOptions = {
    maxAge: 3 * 24 * 60 * 60 * 1000, //3 daYS
    httpOnly: true, //only can access in server
    sameSite: "lax",
    // secure: false,
  };

  res.cookie("AToken", token, accessTokenOptions);

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

export const registrationUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return next(new ErrorHandler("Email Already Exists", 400));
    }

    const user = await userModel.create({ name, email, password });

    createToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const loginUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please provide email and password", 400));
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }
    createToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const logoutUser = CatchAsyncError(async (req, res, next) => {
  res.cookie("AToken", "", { maxAge: 1 });
  res.status(200).json({
    success: true,
    message: "Successfully logged out",
  });
});

//social auth
export const socialAuth = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return next(new ErrorHandler("No Email Specified", 400));
    }
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      const user = await userModel.create({ email, name });
      createToken(user, 200, res);
    } else {
      createToken(userExist, 200, res);
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getUserInfo = CatchAsyncError(async (req, res, next) => {
  try {
    const { user, token } = req;

    if (!user) {
      return next(new ErrorHandler("no user", 400));
    }
    res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const addAdmin = CatchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new ErrorHandler("please provide the email", 400));
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(
        new ErrorHandler("Email is not found make the user signup first", 400),
      );
    }
    user.role = "admin";
    const updatedUserRole = await user.save();
    res.status(201).json({
      success: true,
      updatedUserRole,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const removeAdmin = CatchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("user is not found", 400));
    }
    if (user.role === "user") {
      return next(new ErrorHandler("already user", 400));
    }
    user.role = "user";
    const updatedUserRole = await user.save();
    res.status(201).json({
      success: true,
      updatedUserRole,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getAllUsers = CatchAsyncError(async (req, res, next) => {
  try {
    const users = await userModel.find().sort({ createdAt: -1 });
    res.status(201).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getAllAdmins = CatchAsyncError(async (req, res, next) => {
  try {
    const users = await userModel
      .find({ role: "admin" })
      .sort({ createdAt: -1 });
    res.status(201).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
export const deleteUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return next(new ErrorHandler("user not found", 404));
    }

    await user.deleteOne({ id });
    res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
