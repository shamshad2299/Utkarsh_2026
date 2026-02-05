// src/routes/registrationRoutes.js
import express from "express";
import {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration,
} from "../controllers/registrationController.js";

import { verifyJWT } from "../middleWares/authMiddleWare.js";
import adminAuth from "../middleWares/adminAuth.js";
import { asyncHandler } from "../middleWares/asyncErrorHandlerMiddleWare.js";

const router = express.Router();

/* ================= REGISTRATION ================= */

// Register for event (User)
router.post("/", verifyJWT, asyncHandler(registerForEvent));

// Get my registrations
router.get("/my", verifyJWT, asyncHandler(getMyRegistrations));

// Cancel registration
router.patch("/:id/cancel", verifyJWT, asyncHandler(cancelRegistration));

// Admin → get registrations for event
router.get(
  "/event/:eventId",
  adminAuth,
  asyncHandler(getEventRegistrations),
);

export default router;
