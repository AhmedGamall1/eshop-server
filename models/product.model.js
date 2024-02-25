import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please specify the name of product"],
    },
    description: String,

    category: String,

    price: {
      type: String,
      required: [true, "please specify the price of product"],
    },
    discountPrice: String,

    image: {
      public_id: String,
      url: String,
    },
    tags: String,

    inStore: {
      type: Boolean,
      default: true,
    },
    soldOut: {
      type: Number,
      default: 0,
    },
    additionalInfo: [Object],
    reviews: [Object],
  },
  { timestamps: true },
);

const productModel = mongoose.model("Products", productSchema);

export default productModel;
