// src//Routes/foodStallRoutes.js
import express from "express";
import {
  createFoodStall,
  getMyFoodStalls,
  getAllFoodStalls,
  updateFoodStallStatus,
  deleteFoodStall,
} from "../controllers/foodStallController.js";

import { verifyJWT } from "../middleWares/authMiddleWare.js";
import adminAuth from "../middleWares/adminAuth.js";
import { asyncHandler } from "../middleWares/asyncErrorHandlerMiddleWare.js";

const router = express.Router();

/* ================= FOOD STALL ================= */

// User
router.post("/", verifyJWT, asyncHandler(createFoodStall));
router.get("/my", verifyJWT, asyncHandler(getMyFoodStalls));

// Admin
router.get("/", adminAuth, asyncHandler(getAllFoodStalls));
router.patch("/:id/status", adminAuth, asyncHandler(updateFoodStallStatus));
router.delete("/:id", adminAuth, asyncHandler(deleteFoodStall));

export default router;
