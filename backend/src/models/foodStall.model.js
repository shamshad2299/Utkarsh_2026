// src/models/foodStall.model.js
import mongoose from "mongoose";

const foodStallSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    foodItems: { type: String, required: true },
    ownerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    numberOfStalls: { type: Number, required: true, min: 1 },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const FoodStall = mongoose.model("FoodStall", foodStallSchema);
