import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
  const token = req.cookies.AToken;
  if (!token) {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decoded) {
    return next(new ErrorHandler("token is not valid", 401));
  }
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new ErrorHandler("user is not found", 401));
  }
  req.user = user;
  req.token = token;

  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403,
        ),
      );
    }
    next();
  };
};
