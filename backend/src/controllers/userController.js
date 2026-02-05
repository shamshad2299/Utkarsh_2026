import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/users.model.js";
import { Counter } from "../models/counter.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

// export const registerUser = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const {
//       name,
//       email,
//       password,
//       role,
//       mobile_no,
//       city,
//       gender,
//       college,
//       course,
//     } = req.body;

//     // basic validation
//     if (
//       !name ||
//       !email ||
//       !password ||
//       !mobile_no ||
//       !city ||
//       !gender ||
//       !college ||
//       !course
//     ) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: "All required fields must be provided",
//       });
//     }

//     if (password.length < 8) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 8 characters long",
//       });
//     }

//     // check existing user
//     const existingUser = await User.findOne({ email }).session(session);
//     if (existingUser) {
//       await session.abortTransaction();
//       return res.status(409).json({
//         success: false,
//         message: "User already exists with this email",
//       });
//     }

//     const counter = await Counter.findOneAndUpdate(
//       { name: "userId" },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true, session },
//     );

//     const paddedSeq = counter.seq.toString().padStart(3, "0");
//     const userId = `VSVT26${paddedSeq}`;

//     // create user
//     const user = await User.create(
//       [
//         {
//           name,
//           email,
//           password,
//           role,
//           mobile_no,
//           city,
//           gender,
//           college,
//           course,
//           userId,
//         },
//       ],
//       { session },
//     );

//     //  commit only if EVERYTHING passed
//     await session.commitTransaction();
//     session.endSession();

//     const safeUser = await User.findById(user[0]._id).select(
//       "-password -refreshToken -__v",
//     );

//     // email send with the user => functionality will added at the end

//     return res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       data: safeUser,
//     });
//   } catch (error) {

//     await session.abortTransaction();
//     session.endSession();

//     console.error("Register Error:", error);

//     if (error.name === "ValidationError") {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }

//     if (error.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         message: "Duplicate field value detected",
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };


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

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      userId: user.userId,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

// export const loginUser = async (req, res) => {
//   try {
//     const { identifier, password } = req.body || {};
//     // identifier = email | mobile_no | userId

//     if (!identifier || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "please fill required fields",
//       });
//     }

//     //  find user by email / mobile / userId
//     const user = await User.findOne({
//       $or: [
//         { email: identifier.toLowerCase() },
//         { mobile_no: identifier },
//         { userId: identifier },
//       ],
//       isDeleted: false,
//     }).select("+password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     if (user.isBlocked) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "Your account has been blocked, please contact Admin for further information !",
//       });
//     }

//     // password match

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     // hide sensitive fields
//     // user.password = undefined;
//     // user.refreshToken = undefined;
//     // user.__v = undefined;

//     //generate token
//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     // save refresh token in DB
//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });

//      // refresh token → HttpOnly cookie
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: false, // true in production (HTTPS)
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000
//     });


//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       accessToken,
//       user: {
//         _id: user._id,
//         userId: user.userId,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Login Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

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

//logout 
export const logoutUser = async (req, res) => {
  req.user.refreshToken = null;
  await req.user.save({ validateBeforeSave: false });

  res.clearCookie("refreshToken");

  return res.json({
    success: true,
    message: "Logged out"
  });
};

export const updateUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const {
      name,
      email,
      password,
      role,
      mobile_no,
      city,
      gender,
      college,
      course,
    } = req.body;

    // check user exists
    const user = await User.findById(id).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // email duplicate check (if changed)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email }).session(session);
      if (emailExists) {
        await session.abortTransaction();
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    // update only provided fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (mobile_no) user.mobile_no = mobile_no;
    if (city) user.city = city;
    if (gender) user.gender = gender;
    if (college) user.college = college;
    if (course) user.course = course;

    // password update (optional)
    if (password) {
      if (password.length < 8) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long",
        });
      }
      user.password = password;
    }

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    const safeUser = await User.findById(user._id).select(
      "-password -refreshToken -__v",
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: safeUser,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Update User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};






