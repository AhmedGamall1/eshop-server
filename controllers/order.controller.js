import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";

//Create new order
export const createOrder = CatchAsyncError(async (req, res, next) => {
  try {
    const { cart, shippingAddress, userId, totalPrice, paymentInfo, totalQty } =
      req.body;
    //add more checkers

    const order = await orderModel.create({
      cart,
      shippingAddress,
      userId,
      totalPrice,
      paymentInfo,
      totalQty,
    });
    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//Get all orders of user
export const getUserOrders = CatchAsyncError(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const orders = await orderModel
      .find({ "user._id": userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//Get all orders --- only for admin
export const getAllOrders = CatchAsyncError(async (req, res, next) => {
  try {
    const orders = await orderModel
      .find()
      .select("-cart -shippingAddress -paymentInfo -user")
      .sort({
        deliveredAt: -1,
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//Get single order --- only for admin
export const getSingleOrder = CatchAsyncError(async (req, res, next) => {
  try {
    const order = await orderModel.findById(req.params.id);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//Update order status -- only for admin
export const updateOrderStatus = CatchAsyncError(async (req, res, next) => {
  try {
    const orderId = req.body.id;
    const orderStatus = req.body.status;
    const order = await orderModel.findById(orderId);

    // const updateProduct = async (id, qty) => {
    //   const product = await productModel.findById(id);
    //   product.soldOut += qty;
    //   //missing validate to be false
    //   await product.save();
    // };

    // const updateAdminInfo = async(totalPrice)=>{

    // };

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }
    if (orderStatus === "Processing") {
      order.paymentInfo.status = "Pending";
    }

    if (orderStatus === "Delivered") {
      order.paymentInfo.status = "Succeeded";
    }
    order.status = orderStatus;
    await order.save();
    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
