import express from "express";

import { isAuthenticated } from "../middleware/auth.js";
import { createPayment } from "../controllers/payment.controller.js";
const paymentRouter = express.Router();

paymentRouter.post("/create-payment", isAuthenticated, createPayment);

export default paymentRouter;
