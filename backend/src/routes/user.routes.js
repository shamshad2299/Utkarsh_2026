import express from "express";
import {registerUser,loginUser,logoutUser,updateMyProfile} from "../controllers/user.controller.js";
import { refreshUserAccessToken } from "../controllers/refreshToken.controller.js";
import {requestPasswordReset,resetPassword,} from "../controllers/resetPassword.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// auth
router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/logout", verifyJWT, asyncHandler(logoutUser));

// current logged-in user
router.get("/me", verifyJWT, (req, res) => {res.json({success: true,user: req.user,});});

// update yser profile /me profile
router.patch("/me", verifyJWT, asyncHandler(updateMyProfile));

// refresh token
router.post("/refresh-token", asyncHandler(refreshUserAccessToken));

// password reset
router.post("/request-password", asyncHandler(requestPasswordReset));
router.post("/reset-password", asyncHandler(resetPassword));

export default router;
