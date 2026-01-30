//audit_logs.models.js
import mongoose, { Schema } from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetCollection: {
      type: String, // e.g. "Event", "Team", "User"
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },

    oldData: {
      type: mongoose.Schema.Types.Mixed,
    },

    newData: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: "timestamp", updatedAt: false },
  }
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
