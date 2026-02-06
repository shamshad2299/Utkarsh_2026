// src/routes/adminRoutes.js
import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
} from "../controllers/adminController.js";
import {
  getUsers,
  updateUserStatus,
  updateUserDetails,
} from "../controllers/adminUser.controller.js";
import { asyncHandler } from "../middleWares/asyncErrorHandlerMiddleWare.js";
import adminAuth from "../middleWares/adminAuth.js";
import { refreshAdminAccessToken } from "../controllers/refreshTokenController.js";

const router = express.Router();

/* ================= ADMIN AUTH (STATIC FIRST) ================= */
router.post("/register", asyncHandler(registerAdmin));
router.post("/login", asyncHandler(loginAdmin));
router.post("/refresh-token", asyncHandler(refreshAdminAccessToken));
router.post("/logout", adminAuth, asyncHandler(logoutAdmin));

/* ================= ADMIN → USER MANAGEMENT ================= */

// ✅ Static route first
router.get("/users", adminAuth, asyncHandler(getUsers));

// ✅ More specific dynamic route first
router.patch(
  "/users/:userId/status",
  adminAuth,
  asyncHandler(updateUserStatus)
);

// ✅ Less specific dynamic route LAST
router.patch(
  "/users/:userId",
  adminAuth,
  asyncHandler(updateUserDetails)
);

export default router;
