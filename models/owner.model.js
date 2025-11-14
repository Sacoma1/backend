import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "User name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    lastname: {
      type: String,
      require: [true, "Lastname is required"],
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
    birthDate: {
      type: Date,
      require: [true, "Birth date is required"],
    },
    phone: {
      type: String,
      require: [true, "number is required"],
    },
    gender: {
      type: Stringk,

      enum: ["Hombre", "Mujer", "Prefiero no responder"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Owner = mongoose.model("Owner", ownerSchema);

export default Owner;
