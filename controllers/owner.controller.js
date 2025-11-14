import Appointment from "../models/appoitment.model";
import Owner from "../models/owner.model";
import { Pet } from "../models/pet.model";

export const getOwners = async (req, res, next) => {
  try {
    const owners = await Owner.find();

    if (owners.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Owners not found" });
    }

    res
      .status(200)
      .json({ success: true, owners: owners.length, data: owners });
  } catch (error) {
    next(error);
  }
};

export const getOwner = async (req, res, next) => {
  try {
    const ownerId = req.params.id;
    const owner = await Owner.findById(ownerId);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }
    res.status(200).json({ success: true, data: owner });
  } catch (error) {
    next(error);
  }
};

export const createOwner = async (req, res, next) => {
  try {
    const owner = await Owner.create({ ...req.body });
    res.status(201).json({
      success: true,
      message: "Owner created successfully",
      data: owner,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOwner = async (req, res, next) => {
  const ownerId = req.params.id;
  const updateOwner = await Owner.findByIdAndUpdate(ownerId, req.body, {
    new: true,
    runValidators: true,
  });

  if (updateOwner) {
    return res.status(404).json({
      success: false,
      message: "owner not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Owner information updated successfully",
    data: updateOwner,
  });
};

export const deleteOwner = async (req, res, next) => {
  try {
    const ownerId = req.params.id;

    const owner = await Owner.findById(ownerId);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found ",
      });
    }

    const deletePet = await Pet.deleteMany({ owner: ownerId });
    const deleteAppointment = await Appointment.deleteMany({ owner: ownerId });
    const deleteOwner = await Owner.findByIdAndDelete(ownerId);
    res.status(200).json({
      success: true,
      message: `Owner and associated data deleted successfully. Deleted: ${petDeletionResult.deletedCount} Pet(s) and ${appointmentDeletionResult.deletedCount} Appointment(s).`,
      data: deleteOwner,
    });
  } catch (error) {
    next(error);
  }
};
