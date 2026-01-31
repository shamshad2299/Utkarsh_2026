import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
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
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    permissions: {
      type: [String],
      default: [],
    },
    adminStatus: {
      type: String,
      enum: ["active", "blocked", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

/*  SAFE EXPORT — Prevent overwrite */
const Admin =
  mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export default Admin;
