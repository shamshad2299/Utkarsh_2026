// src/routes/userRoutes.js
import express from "express";
import { getAllUsers, loginUser, logoutUser, registerUser, updateUser } from "../controllers/userController.js";
import {  refreshUserAccessToken } from "../controllers/refreshTokenController.js";
import { requestPasswordReset, resetPassword } from "../controllers/resetPasswordController.js";
import adminAuth from "../middleWares/adminAuth.js";
import { verifyJWT } from "../middleWares/authMiddleWare.js";
import { deleteUser, getUserById } from "../controllers/adminUser.controller.js";
import { asyncHandler } from "../middleWares/asyncErrorHandlerMiddleWare.js";
const router = express.Router();

router.post("/register" , registerUser);
router.post("/login" , loginUser);
router.post("/logout", verifyJWT, logoutUser);

//verify refresh token 
router.post("/refresh-token", asyncHandler(refreshUserAccessToken));

//reset-password through mail
router.post("/request-pass-reset-otp" , asyncHandler(requestPasswordReset));
router.post("/reset-password" , asyncHandler(resetPassword));

//get all user @only for admin
router.get("/users", adminAuth, asyncHandler(getAllUsers));
router.get("/users/:id", adminAuth, asyncHandler(getUserById));
router.put("/update/users/:id", adminAuth, asyncHandler(updateUser));
router.delete("/:id", adminAuth, asyncHandler(deleteUser));

export default router