// src/routes/auditLogRoutes.js
import express from "express";
import {getAuditLogs,getAuditLogsByTarget,} from "../controllers/auditLogController.js";
import adminAuth from "../middleWares/adminAuth.js";
import { asyncHandler } from "../middleWares/asyncErrorHandlerMiddleWare.js";

const router = express.Router();

/* ================= AUDIT LOGS (ADMIN ONLY) ================= */

// Get all audit logs with filters
router.get("/", adminAuth, asyncHandler(getAuditLogs));

// Get audit logs for a specific entity
router.get("/:collection/:id",adminAuth,asyncHandler(getAuditLogsByTarget));

export default router;
