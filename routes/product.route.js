import express from "express";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getAdminProducts,
  getAllProducts,
  getSingleProduct,
} from "../controllers/product.controller.js";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";
const productRouter = express.Router();

productRouter.post(
  "/addProduct",
  isAuthenticated,
  authorizeRoles("admin"),
  addProduct,
);
productRouter.get("/getAllProducts", getAllProducts);
productRouter.get(
  "/getAdminProducts",
  // isAuthenticated,
  // authorizeRoles("admin"),
  getAdminProducts,
);
productRouter.get("/get-single-product/:id", getSingleProduct);

productRouter.delete(
  "/delete-product/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteProduct,
);
productRouter.put(
  "/edit-product/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editProduct,
);

export default productRouter;
