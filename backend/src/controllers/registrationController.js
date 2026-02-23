// src/controllers/registrationController.js
import { Registration } from "../models/registerations.model.js";
import { Event } from "../models/events.model.js";
import { Team } from "../models/team.model.js";
import { ApiError } from "../utils/ApiError.js";

/* ================= REGISTER FOR EVENT ================= */
export const registerForEvent = async (req, res) => {
  const { eventId, teamId, formData } = req.body;
  const userId = req.user._id;

  if (!eventId) {
    throw new ApiError(400, "Event ID is required");
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // registration deadline check
  if (new Date() > new Date(event.registrationDeadline)) {
    throw new ApiError(400, "Registration deadline has passed");
  }

  // Capacity check
  if (event.currentParticipants >= event.capacity) {
    throw new ApiError(400, "Event is full");
  }

  // SOLO EVENT
  if (event.eventType === "solo") {
    const existing = await Registration.findOne({
      eventId,
      userId,
    });

    if (existing) {
      throw new ApiError(409, "Already registered for this event");
    }

    const registration = await Registration.create({
      eventId,
      userId,
      registeredBy: userId,
      formData,
    });

    // Update event participants count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { currentParticipants: 1 }
    });

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: registration,
    });
  }

  // TEAM / DUO EVENT
  if (!teamId) {
    throw new ApiError(400, "Team ID is required for team events");
  }

  const team = await Team.findById(teamId);
  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  const isMember =
    team.teamLeader.toString() === userId.toString() ||
    team.teamMembers.some(
      (member) => member.toString() === userId.toString(),
    );

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this team");
  }

  const teamSize = 1 + team.teamMembers.length;
  if (
    teamSize < event.teamSize.min ||
    teamSize > event.teamSize.max
  ) {
    throw new ApiError(
      400,
      `Team size must be between ${event.teamSize.min} and ${event.teamSize.max}`,
    );
  }

  const existingTeamReg = await Registration.findOne({
    eventId,
    teamId,
  });

  if (existingTeamReg) {
    throw new ApiError(409, "This team is already registered");
  }

  const registration = await Registration.create({
    eventId,
    teamId,
    registeredBy: userId,
    formData,
  });

  // Update event participants count (increment by team size)
  await Event.findByIdAndUpdate(eventId, {
    $inc: { currentParticipants: teamSize }
  });

  res.status(201).json({
    success: true,
    message: "Team registered successfully",
    data: registration,
  });
};

/* ================= GET MY REGISTRATIONS ================= */
export const getMyRegistrations = async (req, res) => {
  const userId = req.user._id;

  const registrations = await Registration.find({
    registeredBy: userId,
  })
    .populate({
      path: "eventId",
      select: "title startTime venueName images eventType category fee capacity currentParticipants registrationDeadline",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .populate("teamId", "teamName teamLeader teamMembers");

  res.status(200).json({
    success: true,
    count: registrations.length,
    data: registrations,
  });
};

/* ================= GET EVENT REGISTRATIONS (ADMIN) ================= */
export const getEventRegistrations = async (req, res) => {
  const { eventId } = req.params;

  const registrations = await Registration.find({ eventId })
    .populate("userId", "name email mob_no")
    .populate({
      path: "teamId",
      populate: [
        { path: "teamLeader", select: "name" },
        { path: "teamMembers", select: "name" },
      ],
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: registrations.length,
    data: registrations,
  });
};

/* ================= DELETE REGISTRATION (HARD DELETE) ================= */
export const deleteRegistration = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // Find registration
  const registration = await Registration.findById(id);
  
  if (!registration) {
    throw new ApiError(404, "Registration not found");
  }

  // Authorization check - only the user who registered or admin can delete
  if (registration.registeredBy.toString() !== userId.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, "Not authorized to delete this registration");
  }

  // Check if event has already started
  const event = await Event.findById(registration.eventId);
  if (!event) {
    throw new ApiError(404, "Associated event not found");
  }

  const now = new Date();
  const eventStart = new Date(event.startTime);
  
  if (now > eventStart) {
    throw new ApiError(400, "Cannot unregister: Event has already started");
  }

  // Check if registration deadline has passed
  if (now > new Date(event.registrationDeadline)) {
    throw new ApiError(400, "Cannot unregister: Registration deadline has passed");
  }

  // For team events, get team size
  let participantDecrement = 1; // default for solo
  if (registration.teamId) {
    const team = await Team.findById(registration.teamId);
    if (team) {
      participantDecrement = 1 + (team.teamMembers?.length || 0);
    }
  }

  // Delete registration (hard delete)
  await Registration.findByIdAndDelete(id);

  // Update event participants count
  await Event.findByIdAndUpdate(registration.eventId, {
    $inc: { currentParticipants: -participantDecrement }
  });

  res.status(200).json({
    success: true,
    message: "Registration deleted successfully",
  });
};

/* ================= GET ALL REGISTRATIONS (ADMIN) ================= */
export const getAllRegistrationsAdmin = async (req, res) => {
  const { type, eventId, userId } = req.query;

  let filter = {};

  if (eventId) {
    filter.eventId = eventId;
  }

  if (userId) {
    filter.$or = [
      { userId },
      { registeredBy: userId }
    ];
  }

  if (type === "solo") {
    filter.$and = [
      {
        $or: [
          { teamId: null },
          { teamId: { $exists: false } }
        ]
      }
    ];
  }

  if (type === "team") {
    filter.teamId = { $ne: null };
  }

  const registrations = await Registration.find(filter)
    .populate("eventId", "title fee venueName eventType startTime currentParticipants")
    .populate("userId", "name email userId mobile_no gender city college course isBlocked")
    .populate({
      path: "teamId",
      populate: [
        { path: "teamLeader", select: "name mobile_no city email college course gender" },
        { path: "teamMembers", select: "name" }
      ]
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: registrations.length,
    data: registrations,
  });
};