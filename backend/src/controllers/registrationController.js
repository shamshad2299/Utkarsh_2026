// src/controllers/registrationController.js
import { Registration } from "../models/registerations.model.js";
import { Event } from "../models/events.model.js";
import { Team } from "../models/team.model.js";
import { ApiError } from "../utils/ApiError.js";
import { logAudit } from "../utils/auditLogger.js";

/* ================= REGISTER FOR EVENT ================= */
export const registerForEvent = async (req, res) => {
  const { eventId, teamId, formData } = req.body;
  const userId = req.user._id;

  if (!eventId) {
    throw new ApiError(400, "Event ID is required");
  }

  const event = await Event.findById(eventId);
  if (!event || event.isDeleted) {
    throw new ApiError(404, "Event not found");
  }

  // registration deadline check
  if (new Date() > new Date(event.registrationDeadline)) {
    throw new ApiError(400, "Registration deadline has passed");
  }

  // SOLO EVENT
  if (event.eventType === "solo") {
    const existing = await Registration.findOne({
      eventId,
      userId,
      isDeleted: false,
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

    // AUDIT LOG (USER)
    await logAudit({
      req,
      action: "REGISTRATION_CREATED",
      targetCollection: "Registration",
      targetId: registration._id,
      newData: registration,
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
  if (!team || team.isDeleted) {
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
    isDeleted: false,
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

  // AUDIT LOG (USER)
  await logAudit({
    req,
    action: "REGISTRATION_CREATED",
    targetCollection: "Registration",
    targetId: registration._id,
    newData: registration,
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
    isDeleted: false,
  })
    .populate({
      path: "eventId",
      select: "title startTime venueName images eventType category fee",
      populate: {
        path: "category",
        select: "name image icon", // jo bhi fields chahiye
      },
    })
    .populate("teamId", "teamName");

  res.status(200).json({
    success: true,
    count: registrations.length,
    data: registrations,
  });
};


/* ================= GET EVENT REGISTRATIONS (ADMIN) ================= */
export const getEventRegistrations = async (req, res) => {
  const { eventId } = req.params;

  const registrations = await Registration.find({
    eventId,
    isDeleted: false,
  })
    .populate("userId", "name userId email")
    .populate("teamId", "teamName")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: registrations.length,
    data: registrations,
  });
};


/* ================= CANCEL REGISTRATION (SOFT DELETE) ================= */
export const cancelRegistration = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Atomic find and lock to prevent race conditions
    const registration = await Registration.findById(id).session(session);
    
    if (!registration || registration.isDeleted) {
      throw new ApiError(404, "Registration not found");
    }

    // Authorization check
    if (registration.registeredBy.toString() !== userId.toString()) {
      throw new ApiError(403, "Not authorized to cancel this registration");
    }

    // Status validation
    if (registration.status === "cancelled") {
      throw new ApiError(400, "Registration is already cancelled");
    }

    if (registration.checkedIn) {
      throw new ApiError(400, "Cannot unregister: Already checked in");
    }

    // Atomic event fetch with lock
    const event = await Event.findById(registration.eventId)
      .select('startTime minCancellationHours allowLateCancellation')
      .session(session);
    
    if (!event) {
      throw new ApiError(404, "Associated event not found");
    }

    // Enhanced time validation with configurable window
    const now = new Date();
    const eventStart = new Date(event.startTime);
    
    if (now > eventStart) {
      throw new ApiError(400, "Cannot unregister: Event has already started");
    }

    // Check cancellation window if applicable
    if (event.minCancellationHours && !event.allowLateCancellation) {
      const hoursUntilEvent = (eventStart - now) / (1000 * 60 * 60);
      if (hoursUntilEvent < event.minCancellationHours) {
        throw new ApiError(
          400, 
          `Cancellation requires ${event.minCancellationHours} hours notice`
        );
      }
    }

    // Capture old state for audit
    const oldData = registration.toObject();

    // Soft delete with atomic update
    const updatedRegistration = await Registration.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "cancelled",
          isDeleted: true,
          cancelledAt: now,
          cancelledBy: userId,
          updatedAt: now
        }
      },
      { new: true, session, runValidators: true }
    );

    // Update event stats atomically
    await Event.findByIdAndUpdate(
      registration.eventId,
      {
        $inc: { 
          currentRegistrations: -1,
          totalCancelled: 1 
        }
      },
      { session }
    );

    // Trigger waitlist processing if needed
    if (event.currentRegistrations >= event.capacity) {
      // Fire and forget - don't wait for processing
      processWaitlist(event._id, session).catch(console.error);
    }

    // Commit transaction
    await session.commitTransaction();

    // Async audit log (don't block response)
    logAudit({
      req,
      action: "REGISTRATION_CANCELLED",
      targetCollection: "Registration",
      targetId: registration._id,
      oldData,
      newData: updatedRegistration,
      userId
    }).catch(console.error);

    // Trigger webhooks asynchronously
    triggerWebhook('registration.cancelled', {
      registrationId: registration._id,
      userId,
      eventId: event._id,
      timestamp: now
    }).catch(console.error);

    res.status(200).json({
      success: true,
      message: "Registration cancelled successfully. You can re-enroll anytime!",
      data: {
        id: updatedRegistration._id,
        status: updatedRegistration.status,
        cancelledAt: updatedRegistration.cancelledAt
      }
    });

  } catch (error) {
    await session.abortTransaction();
    
    // Log error for monitoring
    console.error('Cancel Registration Error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
      registrationId: req.params.id
    });

    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to cancel registration. Please try again.");
  } finally {
    session.endSession();
  }
};

/* ================= RESTORE REGISTRATION (RE-ENROLL) ================= */
export const restoreRegistration = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { teamId, idempotencyKey } = req.body;

    // Idempotency check
    if (idempotencyKey) {
      const existing = await Idempotency.findOne({ 
        key: idempotencyKey,
        userId 
      }).session(session);
      
      if (existing) {
        await session.abortTransaction();
        return res.status(200).json(existing.response);
      }
    }

    // Find registration with optimistic locking
    const registration = await Registration.findOne({
      _id: id,
      registeredBy: userId,
      isDeleted: true,
      status: "cancelled"
    }).session(session);

    if (!registration) {
      throw new ApiError(404, "Registration not found or cannot be restored");
    }

    // Atomic event validation with capacity check
    const event = await Event.findOneAndUpdate(
      { 
        _id: registration.eventId,
        isDeleted: false,
        registrationDeadline: { $gt: new Date() }
      },
      {
        $inc: { currentRegistrations: 1 }
      },
      { 
        new: true,
        session,
        runValidators: true
      }
    );

    if (!event) {
      throw new ApiError(400, "Event not available for registration");
    }

    // Capacity validation
    if (event.currentRegistrations > event.capacity) {
      // Rollback the increment
      await Event.findByIdAndUpdate(
        event._id,
        { $inc: { currentRegistrations: -1 } },
        { session }
      );
      throw new ApiError(400, "Event is full");
    }

    // Team validation for team events
    if (event.eventType !== "solo") {
      if (!teamId) {
        throw new ApiError(400, "Team ID is required for team events");
      }

      // Atomic team validation
      const team = await Team.findOne({
        _id: teamId,
        isDeleted: false
      }).session(session);

      if (!team) {
        throw new ApiError(404, "Team not found");
      }

      // Check team membership
      const isMember = team.teamLeader.toString() === userId.toString() ||
        team.teamMembers.some(m => m.toString() === userId.toString());

      if (!isMember) {
        throw new ApiError(403, "You are not a member of this team");
      }

      // Team size validation
      const teamSize = 1 + team.teamMembers.length;
      if (teamSize < event.teamSize.min || teamSize > event.teamSize.max) {
        throw new ApiError(
          400,
          `Team size must be between ${event.teamSize.min} and ${event.teamSize.max}`
        );
      }

      // Check for existing team registration
      const existingTeamReg = await Registration.findOne({
        eventId: event._id,
        teamId,
        isDeleted: false,
        _id: { $ne: id }
      }).session(session);

      if (existingTeamReg) {
        throw new ApiError(409, "Team already registered for this event");
      }

      registration.teamId = teamId;
    }

    // Capture old state
    const oldData = registration.toObject();

    // Restore registration atomically
    const now = new Date();
    const updatedRegistration = await Registration.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: false,
          status: "confirmed",
          cancelledAt: null,
          cancelledBy: null,
          restoredAt: now,
          restoredBy: userId,
          updatedAt: now,
          teamId: teamId || registration.teamId
        }
      },
      { new: true, session, runValidators: true }
    );

    // Create idempotency record
    if (idempotencyKey) {
      await Idempotency.create([{
        key: idempotencyKey,
        userId,
        response: {
          success: true,
          message: "🎉 Registration restored successfully!",
          data: updatedRegistration
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }], { session });
    }

    // Commit transaction
    await session.commitTransaction();

    // Async operations after successful commit
    Promise.allSettled([
      logAudit({
        req,
        action: "REGISTRATION_RESTORED",
        targetCollection: "Registration",
        targetId: registration._id,
        oldData,
        newData: updatedRegistration,
        userId
      }),
      triggerWebhook('registration.restored', {
        registrationId: registration._id,
        userId,
        eventId: event._id,
        timestamp: now
      }),
      // Clear cache if using Redis
      redisClient?.del(`event:${event._id}:registrations`)
    ]).catch(console.error);

    res.status(200).json({
      success: true,
      message: "🎉 Registration restored successfully! Welcome back to the event!",
      data: {
        id: updatedRegistration._id,
        status: updatedRegistration.status,
        restoredAt: updatedRegistration.restoredAt,
        teamId: updatedRegistration.teamId
      }
    });

  } catch (error) {
    await session.abortTransaction();
    
    // Enhanced error logging
    console.error('Restore Registration Error:', {
      error: error.message,
      code: error.code,
      stack: error.stack,
      userId: req.user?._id,
      registrationId: req.params.id,
      teamId: req.body.teamId
    });

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      throw new ApiError(409, "Duplicate registration detected");
    }

    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(500, "Failed to restore registration. Please try again.");
  } finally {
    session.endSession();
  }
};

/* ================= HELPER FUNCTIONS ================= */

// Waitlist processor
async function processWaitlist(eventId, session) {
  try {
    const waitlisted = await Registration.find({
      eventId,
      status: 'waitlisted',
      isDeleted: false
    })
    .sort({ waitlistedAt: 1 })
    .limit(1)
    .session(session);

    if (waitlisted.length > 0) {
      const registration = waitlisted[0];
      registration.status = 'confirmed';
      registration.waitlistedAt = null;
      await registration.save({ session });

      // Notify user
      await sendNotification({
        userId: registration.registeredBy,
        type: 'WAITLIST_CONFIRMED',
        data: { registrationId: registration._id }
      });
    }
  } catch (error) {
    console.error('Waitlist processing error:', error);
  }
}

// Webhook trigger
async function triggerWebhook(event, data) {
  try {
    await WebhookEvent.create({
      event,
      data,
      status: 'pending',
      attempts: 0
    });
    // Queue webhook for processing
    await webhookQueue.add({ event, data });
  } catch (error) {
    console.error('Webhook trigger error:', error);
  }
}

// Send notification
async function sendNotification({ userId, type, data }) {
  try {
    await Notification.create({
      userId,
      type,
      data,
      read: false
    });
  } catch (error) {
    console.error('Notification error:', error);
  }
}

/* ================= GET ALL REGISTRATIONS (ADMIN) ================= */
export const getAllRegistrationsAdmin = async (req, res) => {
  const { type } = req.query;

  let filter = { isDeleted: false };

if (type === "solo") {
  filter.$or = [
    { teamId: null },
    { teamId: { $exists: false } }
  ];
}

if (type === "team") {
  filter.teamId = { $ne: null };
}


  const registrations = await Registration.find(filter)
    .populate({
      path: "eventId",
      select: "title fee venueName eventType startTime endTime",
    })
    .populate({
      path: "userId",
      select: "-password",
    })
    .populate({
      path: "teamId",
      populate: [
        {
          path: "teamLeader",
          select: "userId name",
        },
        {
          path: "teamMembers",
          select: "name",
        },
      ],
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: registrations.length,
    data: registrations,
  });
};

