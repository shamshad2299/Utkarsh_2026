import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import { refreshAccessToken } from "../controllers/refreshTokenController.js";
import { requestPasswordReset, resetPassword } from "../controllers/resetPasswordController.js";
const router = express.Router();

router.post("/register" , registerUser);
router.post("/login" , loginUser);
//verify refresh token 
router.post("/refresh-token" , refreshAccessToken);

//reset-password through mail
router.post("/request-password" , requestPasswordReset);
router.post("/reset-password" , resetPassword);

export default router