import express from "express";
import {
  addCategory,
  getCategory,
} from "../controllers/category.controller.js";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";
const categoryRouter = express.Router();

categoryRouter.post(
  "/add-categories",
  isAuthenticated,
  authorizeRoles("admin"),
  addCategory,
);

categoryRouter.get("/get-categories", getCategory);

export default categoryRouter;
