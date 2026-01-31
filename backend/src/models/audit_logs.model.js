import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
   action: {
      type: String,
      required: true
   },

   performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
   },

   targetCollection: String,
   targetId: mongoose.Schema.Types.ObjectId,

   eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      index: true
   },

   oldData: mongoose.Schema.Types.Mixed,
   newData: mongoose.Schema.Types.Mixed,

   timestamp: {
      type: Date,
      default: Date.now,
      index: true
   }
});

export const AuditLog = mongoose.model("AuditLog", auditSchema);
