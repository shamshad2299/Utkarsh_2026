import crypto from "crypto";
import { User } from "../models/users.model.js";

export const requestPasswordReset = async (req, res) => {
  try {
    const { identifier } = req.body || {};

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Email or UserId required",
      });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { userId: identifier },
      ],
      isDeleted: false,
    });

    if (!user) {
      //  security: don't reveal user existence
      return res.status(200).json({
        success: true,
        message: "If user exists, verification code sent",
      });
    }

    //  generate 6 digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // hash code before saving
    const hashedCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    user.resetPasswordCode = hashedCode;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save({ validateBeforeSave: false });

    // 📧 SEND EMAIL (mock for now)
    console.log(`Password reset code for ${user.email}: ${resetCode}`);

    return res.status(200).json({
      success: true,
      message: "Verification code sent to email",
      resetCode
    });
  } catch (error) {
    console.error("Reset Request Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { identifier, code, newPassword } = req.body || {};

    if (!identifier || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const hashedCode = crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { userId: identifier },
      ],
      resetPasswordCode: hashedCode,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+resetPasswordCode +resetPasswordExpire");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // set new password 
    user.password = newPassword;

    // clear reset fields
    user.resetPasswordCode = undefined;
    user.resetPasswordExpire = undefined;
    user.refreshToken = null; // logout all sessions

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
