import mongoose from "mongoose";
const { Schema } = mongoose;

const UsersSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required!"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required!"],
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      select: false,
    },
    image: { type: String },
    googleId: { type: String },

    likedSongs: [
      {
        songId: { type: String, required: true },
        likedAt: { type: String, default: new Date().toISOString() },
      },
    ],
  },
  { timestamps: true }
);
const Users = mongoose.models.Users ?? mongoose.model("Users", UsersSchema);
export default Users;
