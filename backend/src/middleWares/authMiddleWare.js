// import jwt from "jsonwebtoken";
// import { User } from "../models/users.model.js";

// export const verifyJWT = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Authorization token missing"
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     const user = await User.findById(decoded._id).select(
//       "-password -refreshToken -__v"
//     );

//     if (!user || user.isDeleted) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found or deleted"
//       });
//     }

//     if (user.isBlocked) {
//       return res.status(403).json({
//         success: false,
//         message: "User account is blocked"
//       });
//     }

//     // attach user to request
//     req.user = user;
//     next();

//   } catch (error) {
//     console.error("JWT Error:", error);

//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token"
//     });
//   }
// };

import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token missing");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decoded._id).select(
    "-password -refreshToken -__v"
  );

  if (!user || user.isDeleted) {
    throw new ApiError(401, "User not found or deleted");
  }

  if (user.isBlocked) {
    throw new ApiError(403, "User account is blocked");
  }

  req.user = user;
  next();
};
