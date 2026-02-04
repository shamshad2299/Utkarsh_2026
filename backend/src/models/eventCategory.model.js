// models/category.js
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description:{
    type : String,
  },
  rules :{
    type : String,
  },
    image: {
    type: String, // ✅ URL only
    required: true,
  },

  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
});

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
