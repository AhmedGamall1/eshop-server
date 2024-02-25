import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import categoryModel from "../models/categories.model.js";

//add category [admin]
export const addCategory = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    const Category = await categoryModel.findOne();
    if (!Category) {
      const createdCategories = await categoryModel.create(data);
      res.status(201).json({
        success: true,
        createdCategories,
      });
    } else {
      Category.categories = data.categories;
      await Category.save();
      res.status(201).json({
        success: true,
        Category,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

//get category [all users]
export const getCategory = CatchAsyncError(async (req, res, next) => {
  try {
    const Category = await categoryModel.find();

    res.status(200).json({
      success: true,
      Category,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
