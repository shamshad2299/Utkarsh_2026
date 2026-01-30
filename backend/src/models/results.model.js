import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    registrationId: {
      type: Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },

    position: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const Result = mongoose.model("Result", resultSchema);
