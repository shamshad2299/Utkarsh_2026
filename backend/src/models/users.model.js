import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Counter } from "./counter.model.js";

const userSchema = new mongoose.Schema(
{
   utkarshId: {
      type: String,
      unique: true,
      index: true
   },

   username: {
      type: String,
      required: true,
      trim: true
   },
    
   email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
      index: true
   },

   password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
   },

   role: {
      type: String,
      enum: ["user", "eventAdmin", "superAdmin"],
      default: "user",
      index: true
   },

   mobile_no: {
      type: String,
      required: true,
      trim: true
   },

   city: {
      type: String,
      required: true,
      trim: true
   },

   gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true
   },

   college: {
      type: String,
      required: true,
      trim: true
   },

   course: {
      type: String,
      required: true,
      trim: true
   },

   isBlocked: {
      type: Boolean,
      default: false
   },

   isDeleted: {
      type: Boolean,
      default: false,
      index: true
   },

   refreshToken: {
      type: String,
      select: false
   }
},
{
   timestamps: true,
   toJSON: {
      transform(doc, ret){
         delete ret.password;
         delete ret.refreshToken;
         delete ret.__v;
         return ret;
      }
   }
});


// ⭐ Generate Utkarsh ID automatically
userSchema.pre("save", async function(next){

   if(!this.utkarshId){
      const counter = await Counter.findOneAndUpdate(
         { _id: "utkarshUserId" },
         { $inc: { seq: 1 } },
         { new: true, upsert: true }
      );

      const year = new Date().getFullYear().toString().slice(-2);

      this.utkarshId = `UTK${year}-${counter.seq
         .toString()
         .padStart(4, "0")}`;
   }

   if(!this.isModified("password")) return next();

   this.password = await bcrypt.hash(this.password, 10);
   next();
});


userSchema.methods.comparePassword = async function(password){
   return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
