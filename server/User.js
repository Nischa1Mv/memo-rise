import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    
    profilePicture: {
      type: String,
      default: profilePicture,
    },
    timestamps: true,
  }
);

// Ensure unique indexes for email and username
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.Users || mongoose.model("Users", userSchema);

export default User;