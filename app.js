import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import categoryRouter from "./routes/category.route.js";
import orderRouter from "./routes/order.route.js";
import paymentRouter from "./routes/payment.route.js";

export const app = express();
dotenv.config();
const port = 8000 || process.env.PORT;

//middlewares
app.use(express.json({ limit: "50mb" })); //handle the body of post req
app.use(cookieParser()); //lib make me set cookies in easier way
app.use(
  cors(),
  //   {
  //   origin: ["https://eshop-client-xijq.vercel.app"],
  //   credentials: true,
  // }
  // origin: ["http://localhost:3000"],
);

//routes
app.use(
  "/api/v1",
  userRouter,
  productRouter,
  categoryRouter,
  orderRouter,
  paymentRouter,
);
app.get("/", (req, res) => {
  res.json({ message: "api is working" });
});
//middleware calls
app.use(ErrorMiddleware);
