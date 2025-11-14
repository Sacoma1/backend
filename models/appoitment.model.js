import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: [
        true,
        "El ID de la mascota es obligatorio para programar la cita.",
      ],
    },

    date: {
      type: Date,
      required: [true, "La fecha y hora de la cita son obligatorias."],
    },
    reason: {
      type: String,
      enum: [
        "Estetica",
        "Consulta veterinaria",
        "Cirugia",
        "Vacunacion",
        "Urgencia",
      ],
      required: [true, "El motivo de consulta es obligatorio"],
    },

    status: {
      type: String,
      enum: [
        "Programada",
        "Confirmada",
        "Cancelada",
        "Completada",
        "No Asistió",
        "Re-agendada",
      ],
      default: "Programada",
    },

    veterinarianNotes: {
      type: String,
      trim: true,
      default: "",
    },

    veterinarian: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      
    },

   
  },

  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
