import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token missing");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired admin token");
  }

  const admin = await Admin.findById(decoded.id).select("-password");

  if (!admin) {
    throw new ApiError(401, "Admin not found");
  }

  if (admin.adminStatus !== "active") {
    throw new ApiError(403, "Admin access not active");
  }

  req.admin = admin;
  next();
};

export default adminAuth;
