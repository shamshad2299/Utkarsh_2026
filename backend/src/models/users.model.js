// user.models.js
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: 8,
    },

    role: {
      type: String,
      enum: ["user", "eventAdmin", "superAdmin"],
      default: "user",
      index: true,
    },

    mobile_no: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    college: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    userId: {
      type: String,
      unique: true,
      index: true,
    },

    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

/* PRE SAVE HOOK                                      */
userSchema.pre("save", async function () {
  // normalize email
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
});

export const User = mongoose.model("User", userSchema);
