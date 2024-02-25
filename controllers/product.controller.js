import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import productModel from "../models/product.model.js";
import cloudinary from "cloudinary";

//Get all products
export const getAllProducts = CatchAsyncError(async (req, res, next) => {
  try {
    const category = req.query.category || null;
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const totalItems = await productModel.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    if (category) {
      const products = await productModel
        .find({ category })
        .sort({ createdAt: -1 });

      if (!products) {
        return next(new ErrorHandler("no products found", 400));
      }
      res.status(200).json({
        success: true,
        products,
      });
    } else {
      const products = await productModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      if (!products) {
        return next(new ErrorHandler("no products found", 400));
      }
      res.status(200).json({
        success: true,
        products,
        totalPages,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

//Get all products -- admins
export const getAdminProducts = CatchAsyncError(async (req, res, next) => {
  try {
    const products = await productModel.find();
    if (!products) {
      return next(new ErrorHandler("no products found", 400));
    }
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

//Get single product
export const getSingleProduct = CatchAsyncError(async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    if (!product) {
      return next(new ErrorHandler("product not found", 500));
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

//Add product --- only for admin
export const addProduct = CatchAsyncError(async (req, res, next) => {
  try {
    const { data } = req.body;
    const name = data.name;
    const productExist = await productModel.findOne({ name });
    if (productExist) {
      return next(new ErrorHandler("product name already exisit", 400));
    }
    if (!data.image) {
      return next(new ErrorHandler("please provide product image", 400));
    }
    const myCloud = await cloudinary.v2.uploader.upload(data.image, {
      folder: "products",
    });
    data.image = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
    const product = await productModel.create(data);
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

//Edit product --- only for admin
export const editProduct = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    const image = data.image;
    const productId = req.params.id;
    const productData = await productModel.findById(productId);

    if (!productData) {
      return next(new ErrorHandler("product not found", 500));
    }

    //handle image change
    if (!image.startsWith("https")) {
      await cloudinary.v2.uploader.destroy(productData.image.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "products",
      });
      data.image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    } else {
      data.image = productData.image;
    }

    const product = await productModel.findByIdAndUpdate(
      productId,
      //$set => ht8ayr el et8ayr bs
      { $set: data },
      { new: true },
    );
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//Delete product --- only for admin
export const deleteProduct = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }

    await course.deleteOne({ id });

    res.status(200).json({
      success: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
