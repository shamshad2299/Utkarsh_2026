import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import { refreshAccessToken } from "../controllers/refreshTokenController.js";
const router = express.Router();

router.post("/register" , registerUser);
router.post("/login" , loginUser);
//verify refresh token 
router.post("/refresh-token" , refreshAccessToken);

export default router