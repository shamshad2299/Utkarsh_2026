// src/models/users.model.js
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: { 
      type: String, 
      required: [true, "Name is required"], 
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address"
      ]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },

    mobile_no: { 
      type: String, 
      required: [true, "Mobile number is required"], 
      trim: true,
      validate: {
        validator: function(v) {
          // Basic mobile number validation (10-15 digits, optional + prefix)
          return /^[+]?[\d]{10,15}$/.test(v.replace(/[\s-]/g, ''));
        },
        message: "Please provide a valid mobile number"
      }
    },
    
    city: { 
      type: String, 
      required: [true, "City is required"], 
      trim: true,
      minlength: [2, "City name must be at least 2 characters long"]
    },

    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be either male, female, or other"
      },
      required: [true, "Gender is required"],
    },

    college: { 
      type: String, 
      required: [true, "College name is required"], 
      trim: true,
      minlength: [2, "College name must be at least 2 characters long"]
    },
    
    course: { 
      type: String, 
      required: [true, "Course name is required"], 
      trim: true,
      minlength: [2, "Course name must be at least 2 characters long"]
    },

    role: {
      type: String,
      enum: {
        values: ["user"],
        message: "Role must be user"
      },
      default: "user",
      index: true,
    },

    isBlocked: { 
      type: Boolean, 
      default: false 
    },
    
    isDeleted: { 
      type: Boolean, 
      default: false, 
      index: true 
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true
    },

    refreshToken: { 
      type: String, 
      select: false 
    },
    
    resetPasswordCode: { 
      type: String, 
      select: false 
    },
    
    resetPasswordExpire: { 
      type: Date, 
      select: false 
    },
    
    emailVerificationCode: {
      type: String,
      select: false
    },
    
    emailVerificationExpire: {
      type: Date,
      select: false
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-save middleware to hash password - SIMPLIFIED VERSION (no next)
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if user is active
userSchema.methods.isActive = function () {
  return !this.isBlocked && !this.isDeleted;
};

// Static method to find active users
userSchema.statics.findActive = function () {
  return this.find({ isBlocked: false, isDeleted: false });
};

// Virtual for full profile URL
userSchema.virtual('profileUrl').get(function() {
  return `/users/${this.userId}`;
});

// Index for better query performance
userSchema.index({ email: 1, isDeleted: 1 });
userSchema.index({ mobile_no: 1 }, { unique: true, sparse: true });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model("User", userSchema);