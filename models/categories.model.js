import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  categories: [String],
});

const categoryModel = mongoose.model("Categories", categorySchema);

export default categoryModel;
