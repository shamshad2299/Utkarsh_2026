import express from "express";
import {  createTeam,addTeamMember,removeTeamMember,getMyTeams,getTeamById,deleteTeam,} from "../controllers/teamController.js";
import { verifyJWT } from "../middleWares/authMiddleWare.js";
import { asyncHandler } from "../middleWares/asyncErrorHandlerMiddleWare.js";

const router = express.Router();

/* ================= TEAMS ================= */

// Create team
router.post("/", verifyJWT, asyncHandler(createTeam));

// My teams
router.get("/my", verifyJWT, asyncHandler(getMyTeams));

// Get team by id
router.get("/:id", verifyJWT, asyncHandler(getTeamById));

// Add member (leader only)
router.post("/:teamId/members",verifyJWT,asyncHandler(addTeamMember),);

// Remove member (leader only)
router.delete("/:teamId/members/:memberId",verifyJWT,asyncHandler(removeTeamMember),);

// Delete team (leader only)
router.delete("/:id", verifyJWT, asyncHandler(deleteTeam));

export default router;
