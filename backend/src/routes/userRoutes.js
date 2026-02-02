import express from "express";
import { deleteUser, getAllUsers, getUserById, loginUser, registerUser, updateUser } from "../controllers/userController.js";
import { refreshAccessToken } from "../controllers/refreshTokenController.js";
import { requestPasswordReset, resetPassword } from "../controllers/resetPasswordController.js";
import adminAuth from "../middleWares/adminAuth.js";
const router = express.Router();

router.post("/register" , registerUser);
router.post("/login" , loginUser);
//verify refresh token 
router.post("/refresh-token" , refreshAccessToken);

//reset-password through mail
router.post("/request-password" , requestPasswordReset);
router.post("/reset-password" , resetPassword);

//get all user @only for admin
router.get("/users", adminAuth, getAllUsers);
router.get("/users/:id", adminAuth, getUserById);
router.put("/users/:id", adminAuth, updateUser);
router.delete("/users/:id", adminAuth, deleteUser);



export default router