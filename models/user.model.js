import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "User name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      require: [true, "User name is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "P lease fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User Password is required"],
      trim: true,
      minLength: 6,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
