import express from "express";
import {registerAdmin,loginAdmin,logoutAdmin,} from "../controllers/admin.controller.js";
import {getUsers,updateUserStatus,updateUserDetails,} from "../controllers/adminUsers.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import adminAuth from "../middlewares/adminAuth.js";
import { refreshAdminAccessToken } from "../controllers/refreshToken.controller.js";

const router = express.Router();

/* ================= ADMIN AUTH ================= */
router.post("/register", asyncHandler(registerAdmin));
router.post("/login", asyncHandler(loginAdmin));
router.post("/logout", adminAuth, asyncHandler(logoutAdmin));
router.post("/refresh-token", asyncHandler(refreshAdminAccessToken));

/* ================= ADMIN → USER MANAGEMENT ================= */
router.get("/users",adminAuth,asyncHandler(getUsers));

// Block / Unblock user
router.patch("/users/:userId/status",adminAuth,asyncHandler(updateUserStatus));

// FULL USER UPDATE BY ADMIN
router.patch("/users/:userId",adminAuth,asyncHandler(updateUserDetails));

export default router;
