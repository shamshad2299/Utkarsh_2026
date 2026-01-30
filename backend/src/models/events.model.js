//events.models.js
import mongoose, { Schema } from "mongoose";
const eventSchema = new mongoose.Schema(
  {
    // Admin who created the event
    eventAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic info
    title: {
      type: String,
      required: true,
      trim: true,
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
        "others",
      ],
      required: true,
    },

    eventTitle: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    venueName: {
      type: String,
      required: true,
    },

    // Date & Time
    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String, // e.g. "10:00 AM"
      required: true,
    },

    endTime: {
      type: String, // e.g. "1:00 PM"
      required: true,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    // Registration details
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    fee: {
      type: Number,
      default: 0,
      min: 0,
    },

    eventType: {
      type: String,
      enum: ["solo", "duo", "team"],
      required: true,
    },

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Event", eventSchema);
