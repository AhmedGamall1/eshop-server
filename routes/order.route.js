import express from "express";
import {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";
const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOrder);

orderRouter.get(
  "/get-admin-orders",
  // isAuthenticated,
  // authorizeRoles("admin"),
  getAllOrders,
);

orderRouter.get(
  "/get-admin-order/:id",
  // isAuthenticated,
  // authorizeRoles("admin"),
  getSingleOrder,
);

orderRouter.put(
  "/update-order-status",
  isAuthenticated,
  authorizeRoles("admin"),
  updateOrderStatus,
);
export default orderRouter;
