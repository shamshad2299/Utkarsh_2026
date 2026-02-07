// src/routes/sponsorshipRoutes.js
import express from "express";
import {createSponsorship,getMySponsorships,getAllSponsorships,updateSponsorshipStatus,deleteSponsorship,} from "../controllers/sponsorshipController.js";
import { verifyJWT } from "../middlewares/authMiddleWare.js";
import adminAuth from "../middlewares/adminAuth.js";
import { asyncHandler } from "../middlewares/asyncErrorHandlerMiddleWare.js";

const router = express.Router();

/* ================= SPONSORSHIP ================= */

// ================= USER ROUTES (STATIC FIRST) =================

// Create sponsorship request
router.post("/", verifyJWT, asyncHandler(createSponsorship));

// Get logged-in user's sponsorships
router.get("/my", verifyJWT, asyncHandler(getMySponsorships));

// ================= ADMIN ROUTES =================

// Get all sponsorships
router.get("/", adminAuth, asyncHandler(getAllSponsorships));

// More specific dynamic route first
router.patch("/:id/status",adminAuth,asyncHandler(updateSponsorshipStatus));

// Generic dynamic route LAST
router.delete("/:id",adminAuth,asyncHandler(deleteSponsorship));

export default router;
