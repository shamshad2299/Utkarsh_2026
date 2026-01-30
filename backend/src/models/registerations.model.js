//registerations.models.js
import mongoose, { Schema } from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // solo registration
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null, // team registration
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    formData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // You can remove this later if not needed
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "confirmed",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "done"],
      default: "done", // since no payment system
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Registration = mongoose.model("Registration", registrationSchema);
