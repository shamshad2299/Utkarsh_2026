// src/routes/eventRoutes.js
import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import adminAuth from "../middleWares/adminAuth.js";
import { upload } from "../middleWares/upload.js";
import { asyncHandler } from "../middleWares/asyncErrorHandlerMiddleWare.js";

const router = express.Router();

/* ================= EVENTS ================= */

// Create event (Admin)
router.post(
  "/",
  adminAuth,
  upload.array("images", 5),
  asyncHandler(createEvent),
);

// Get all events (Public / User)
router.get("/", asyncHandler(getAllEvents));

// Get event by id
router.get("/:id", asyncHandler(getEventById));

// Update event (Admin)
router.put(
  "/:id",
  adminAuth,
  upload.array("images", 5),
  asyncHandler(updateEvent),
);

// Delete event (Admin – soft delete)
router.delete("/:id", adminAuth, asyncHandler(deleteEvent));

export default router;
