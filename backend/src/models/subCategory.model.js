// subCategory.model.js
import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    enum: [
      "cultural",
      "sports",
      "technical",
      "fine_arts",
      "literary",
      "hotel_management",
      "others"
    ],
    required: true,
    index: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  }
},
{ timestamps: true }
);

// ye duplicates k liye ki , taki duplicate na ho 
subCategorySchema.index(
  { name: 1, category: 1 },
  { unique: true }
);

export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
