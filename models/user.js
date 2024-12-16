import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
