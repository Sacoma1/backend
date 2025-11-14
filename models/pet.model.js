import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: [
        true,
        "El ID del propietario es obligatorio para el registro.",
      ],
    },

    petName: {
      type: String,
      required: [true, "El nombre de la mascota es obligatorio."],
      trim: true,
      minlength: 2,
    },
    chipNumber: {
      type: String,
      required: [true, "El número de chip/identificación es obligatorio."],
      unique: true,
      trim: true,
    },

    species: {
      type: String,
      enum: ["Perro", "Gato", "Otro"],
      required: [true, "La especie de la mascota es obligatoria."],
    },
    breed: {
      type: String,
      trim: true,
      default: "Mestizo/Desconocido",
    },
    birthDate: {
      type: Date,
      validate: {
        validator: (value) => value <= new Date(),
        message: "La fecha de nacimiento no puede ser una fecha futura.",
      },
    },
    gender: {
      type: String,
      enum: ["Macho", "Hembra"],
      required: [true, "El género/estado de la mascota es obligatorio."],
    },
    color: {
      type: String,
      trim: true,
    },
    weight: {
      type: Number,
    },
  },

  { timestamps: true }
);

export const Pet = mongoose.model("Pet", petSchema);
