import mongoose, { Schema } from "mongoose";

const sponsorshipSchema = new Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    businessType: {
      type: String, // Type of Business / Market Segment
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    permanentAddress: {
      type: String,
      required: true,
      trim: true,
    },

    sponsorshipCategory: {
      type: String,
      enum: ["associate", "event", "other"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Sponsorship = mongoose.model("Sponsorship", sponsorshipSchema);
