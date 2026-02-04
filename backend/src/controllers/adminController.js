import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import dotenv from "dotenv"
dotenv.config();

// export const registerAdmin = async (req, res) => {
//   try {
//     const { name, email, password } = req.body || {};

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(409).json({
//         success: false,
//         message: "Admin already exists",
//       });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const admin = await Admin.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Admin registered successfully",
//       admin: {
//         id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         adminStatus : admin.adminStatus
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Admin registration failed",
//     });
//   }
// };

//login
// export const loginAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password required",
//       });
//     }

//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     //  FIXED FIELD NAMES
//     if (admin.adminStatus === "blocked") {
//       return res.status(403).json({
//         success: false,
//         message: "Admin access blocked",
//       });
//     }

//     if (admin.adminStatus === "pending") {
//       return res.status(403).json({
//         success: false,
//         message: "Status pending, contact active-admin",
//       });
//     }

//     const token = jwt.sign(
//       {
//         id: admin._id,
//         email: admin.email,
//         adminStatus: admin.adminStatus,
//       },
//       process.env.JWT_SECRET_ADMIN,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       success: true,
//       message: "Admin login successful",
//       token,
//       admin: {
//         id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         adminStatus: admin.adminStatus,
//       },
//     });
//   } catch (error) {
//   console.error("LOGIN ERROR 👉", error);
//   res.status(500).json({
//     success: false,
//     message: error.message,
//   });
// }

// };

/* ================= TOKEN HELPERS ================= */
export const generateAdminAccessToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      adminStatus: admin.adminStatus,
    },
    process.env.JWT_SECRET_ADMIN,
    { expiresIn: process.env.JWT_ADMIN_EXPIRY }
  );
};

export const generateAdminRefreshToken = (admin) => {
  return jwt.sign(
    { id: admin._id },
    process.env.JWT_REFRESH_SECRET_ADMIN,
    { expiresIn: process.env.JWT_ADMIN_REFRESH_EXPIRY }
  );
};

/* ================= REGISTER ADMIN ================= */
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    throw new ApiError(409, "Admin already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      adminStatus: admin.adminStatus,
    },
  });
};

/* ================= LOGIN ADMIN ================= */
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (admin.adminStatus === "blocked") {
    throw new ApiError(403, "Admin access blocked");
  }

  if (admin.adminStatus === "pending") {
    throw new ApiError(403, "Status pending, contact active-admin");
  }

  const accessToken = generateAdminAccessToken(admin);
  const refreshToken = generateAdminRefreshToken(admin);

  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });

  res.cookie("adminRefreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Admin login successful",
    accessToken,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      adminStatus: admin.adminStatus,
    },
  });
};

/* ================= LOGOUT ADMIN ================= */
export const logoutAdmin = async (req, res) => {
  req.admin.refreshToken = null;
  await req.admin.save({ validateBeforeSave: false });

  res.clearCookie("adminRefreshToken");

  res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
};

