import Appointment from "../models/appoitment.model.js";
import { Pet } from "../models/pet.model.js";

export const getUnassignedAppointments = async (req, res, next) => {
  try {
    const appoiments = await Appointment.find({
      "veterinarian.user": { $exists: false },
    }).populate("pet", "petName chipNumber owner");
    res
      .status(200)
      .json({ success: true, count: appoiments.length, data: appoiments });
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req, res, next) => {
  try {
    if (!petId) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }
    const petExists = await Pet.findById(petId);
    if (!petExists) {
      return res.status(404).json({
        success: false,
        message: "Mascota no encontrada. No se puede programar la cita.",
      });
    }
    const appointment = await Appointment.create({
      ...req.body,
    });
    res.status(201).json({ success: true, data: appointment });
  } catch (e) {
    next(e);
  }
};

export const getUserAppointments = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error(
        "You are not allowed to view this account's appointments"
      );
      error.status = 403;
      throw error;
    }
    const appointments = await Appointment.find({
      "veterinarian.user": req.params.id,
    }).populate("pet", "petName species chipNumber");

    res.status(200).json({ success: true, data: appointments });
  } catch (e) {
    next(e);
  }
};

export const assignVeterinarian = async (req, res, next) => {
  try {
    const appoitmentId = req.params.id;
    const veterinarianId = req.user.id || req.user._id;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appoitmentId,
      {
        veterinarian: { user: veterinarianId },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("pet", "petName species");
    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "appointment not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "The veterinarian was successfully assigned",
      data: updatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const appoitmentId = req.params.id;

    const deleteAppointment = await Appointment.findByIdAndDelete(appoitmentId);

    if (!deleteAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment doesn't exist",
      });
    }

    res.status(200).json({
      success: true,
      message: "The appointment was deleted successfully",
      data: deleteAppointment,
    });
  } catch (error) {
    next(error);
  }
};
