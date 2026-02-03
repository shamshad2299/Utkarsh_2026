import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";
import { Counter } from "../models/counter.model.js";
import { ApiError } from "../utils/ApiError.js";

/* ================= REGISTER USER ================= */
export const registerUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      name,
      email,
      password,
      mobile_no,
      city,
      gender,
      college,
      course,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !mobile_no ||
      !city ||
      !gender ||
      !college ||
      !course
    ) {
      throw new ApiError(400, "All required fields must be provided");
    }

    if (password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters long");
    }

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new ApiError(409, "User already exists with this email");
    }

    const counter = await Counter.findOneAndUpdate(
      { name: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session }
    );

    const paddedSeq = counter.seq.toString().padStart(4, "0");
    const userId = `VSVT26${paddedSeq}`;

    const user = await User.create(
      [
        {
          name,
          email,
          password,
          mobile_no,
          city,
          gender,
          college,
          course,
          userId,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    const safeUser = await User.findById(user[0]._id).select(
      "-password -refreshToken -__v"
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: safeUser,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error; 
  } finally {
    session.endSession();
  }
};

/* ================= TOKEN HELPERS ================= */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      userId: user.userId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

/* ================= LOGIN USER ================= */
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body || {};

  if (!identifier || !password) {
    throw new ApiError(400, "Please fill required fields");
  }

  const user = await User.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { mobile_no: identifier },
      { userId: identifier },
    ],
    isDeleted: false,
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.isDeleted) {
    throw new ApiError(404, "User account not found");
  }

  if (user.isBlocked) {
    throw new ApiError(
      403,
      "Your account has been blocked, please contact Admin"
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    user: {
      _id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
    },
  });
};

/* ================= UPDATE USER DETAILS ================= */
export const updateMyProfile = async (req, res) => {
  const allowedUpdates = [
    "name",
    "city",
    "college",
    "course",
    "gender",
    "mobile_no",
  ];

  const updates = {};

  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select("-password -refreshToken -__v");

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
};

/* ================= LOGOUT USER ================= */
export const logoutUser = async (req, res) => {
  req.user.refreshToken = null;
  await req.user.save({ validateBeforeSave: false });

  res.clearCookie("refreshToken");

  res.json({
    success: true,
    message: "Logged out",
  });
};
