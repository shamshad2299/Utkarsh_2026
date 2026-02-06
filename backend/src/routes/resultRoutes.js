// src/routes/resultRoutes.js
import express from "express";
import {addResult,getResultsByEvent,lockResults,deleteResult,} from "../controllers/resultController.js";
import adminAuth from "../middleWares/adminAuth.js";
import { asyncHandler } from "../middleWares/asyncErrorHandlerMiddleWare.js";

const router = express.Router();

/* ================= RESULTS ================= */

// Add result (Admin)
router.post("/", adminAuth, asyncHandler(addResult));

// Get results by event (Public)
router.get("/event/:eventId", asyncHandler(getResultsByEvent));

// Lock results (Admin)
router.patch("/event/:eventId/lock",adminAuth,asyncHandler(lockResults),);

// Delete result (Admin)
router.delete("/:id", adminAuth, asyncHandler(deleteResult));

export default router;
