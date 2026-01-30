//user.models.js
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
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
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: 8
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
  }
);

userSchema.pre("save", async function(next){

   if(this.email){
      this.email = this.email.toLowerCase();
   }

   if(!this.isModified("password")) return next();

   this.password = await bcrypt.hash(this.password, 10);
   next();
});


userSchema.methods.comparePassword = async function(password){
   return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
