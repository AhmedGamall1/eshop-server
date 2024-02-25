import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    cart: {
      type: Array,
      required: true,
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalQty: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Processing",
    },
    paymentInfo: {
      status: {
        type: String,
      },
      type: {
        type: String,
      },
    },
    paidAt: {
      type: Date,
      default: Date.now(),
    },
    deliveredAt: {
      type: Date,
    },
    orderNumber: { type: Number, default: 0 },
  },
  { timestamps: true },
);

orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Ensure only for new documents
    const maxValue = await this.constructor
      .findOne()
      .sort({ orderNumber: -1 })
      .select("orderNumber"); // Get current highest value
    this.orderNumber = maxValue ? maxValue.orderNumber + 1 : 1; // Handle initial value
  }
  next();
});
const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;
