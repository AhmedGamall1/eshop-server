import express from "express";
import {
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  addAdmin,
  removeAdmin,
  getAllUsers,
  deleteUser,
  getAllAdmins,
} from "../controllers/user.controller.js";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);

userRouter.post("/login", loginUser);

userRouter.post("/socialAuth", socialAuth);

userRouter.post("/logout", isAuthenticated, logoutUser);

userRouter.get("/me", isAuthenticated, getUserInfo);

userRouter.put(
  "/add-admin",
  isAuthenticated,
  authorizeRoles("admin"),
  addAdmin,
);
userRouter.put(
  "/remove-admin",
  isAuthenticated,
  authorizeRoles("admin"),
  removeAdmin,
);

userRouter.get(
  "/get-users",
  // isAuthenticated,
  // authorizeRoles("admin"),
  getAllUsers,
);

userRouter.get(
  "/get-admins",
  // isAuthenticated,
  // authorizeRoles("admin"),
  getAllAdmins,
);

userRouter.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser,
);

export default userRouter;
