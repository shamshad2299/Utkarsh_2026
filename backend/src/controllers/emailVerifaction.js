// src/controllers/auth.controller.js

import { User } from "../models/users.model.js";
import { sendEmailBrevo } from "../utils/sendEmail.js";
import {ApiError} from "../utils/ApiError.js"

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new ApiError(400, "Email and OTP are required");
    }

    // Find user with valid OTP
    const user = await User.findOne({
      email,
      emailVerificationCode: otp,
      emailVerificationExpire: { $gt: Date.now() },
    }).select("+emailVerificationCode +emailVerificationExpire");

    if (!user) {
      throw new ApiError(400, "Invalid or expired OTP");
    }

    // Update user verification status
    user.isVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    throw error;
  }
};
// src/controllers/auth.controller.js

export const resendVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
      throw new ApiError(400, "Email already verified");
    }

    // Generate new OTP
    const emailVerificationCode = crypto.randomInt(100000, 999999).toString();
    const emailVerificationExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.emailVerificationCode = emailVerificationCode;
    user.emailVerificationExpire = emailVerificationExpire;
    await user.save({ validateBeforeSave: false });

    // Send new OTP email
    await sendEmailBrevo({
      to: email,
      subject: "New Verification OTP - VSV TUTORIALS",
      template: "emailVerification",
      data: {
        name: user.name,
        otp: emailVerificationCode,
        expiry: "10 minutes",
      },
    });

    res.status(200).json({
      success: true,
      message: "New verification OTP sent successfully",
    });
  } catch (error) {
    throw error;
  }
};