import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
{
   title: {
      type: String,
      required: true,
      trim: true,
      index: true
   },

   category: {
      type: String,
      enum: [
         "cultural",
         "sports",
         "technical",
         "fine_arts",
         "literary",
         "hotel_management",
         "others"
      ],
      required: true,
      index: true
   },

   subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
      index: true
   },


   description: {
      type: String,
      required: true
   },

   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },

   eventAdmins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
   }],

   venueName: {
      type: String,
      required: true
   },

   date: {
      type: Date,
      required: true,
      index: true
   },

   startTime: {
      type: Date,
      required: true
   },

   endTime: {
      type: Date,
      required: true
   },

   registrationDeadline: {
      type: Date,
      required: true
   },

   capacity: {
      type: Number,
      required: true,
      min: 1
   },

   fee: {
      type: Number,
      default: 0,
      min: 0
   },

   eventType: {
      type: String,
      enum: ["solo", "duo", "team"],
      required: true
   },

   resultsLocked: {
      type: Boolean,
      default: false
   },

   isDeleted: {
      type: Boolean,
      default: false,
      index: true
   }
},
{ timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
