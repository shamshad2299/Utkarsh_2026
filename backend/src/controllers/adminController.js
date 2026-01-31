import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists",
      });
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
        adminStatus : admin.adminStatus
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin registration failed",
    });
  }
};

//login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //  FIXED FIELD NAMES
    if (admin.adminStatus === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Admin access blocked",
      });
    }

    if (admin.adminStatus === "pending") {
      return res.status(403).json({
        success: false,
        message: "Status pending, contact active-admin",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        adminStatus: admin.adminStatus,
      },
      process.env.JWT_SECRET_ADMIN,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        adminStatus: admin.adminStatus,
      },
    });
  } catch (error) {
  console.error("LOGIN ERROR 👉", error);
  res.status(500).json({
    success: false,
    message: error.message,
  });
}

};

