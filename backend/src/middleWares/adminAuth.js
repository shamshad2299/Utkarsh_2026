import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import dotenv from "dotenv"
dotenv.config();

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
   
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (admin.adminStatus === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Admin access blocked",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default adminAuth;
