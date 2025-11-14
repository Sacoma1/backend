import Owner from "../models/owner.model";
import { Pet } from "../models/pet.model";

export const getPets = async (req, res, next) => {
  try {
    const pets = await Pet.find().populate("owner", "ownerName email phone");

    if (pets.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Pets not found" });
    }

    res.status(200).json({ success: true, pets: pets.length, data: pets });
  } catch (error) {
    next(error);
  }
};

export const getPet = async (req, res, next) => {
  try {
    const petId = req.params.id;
    const pet = await Pet.findById(petId).populate(
      "owner",
      "ownerName email phone"
    );

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }
    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    next(error);
  }
};

export const createPet = async (req, res, next) => {
  try {
    const ownerId = req.params.owner;
    if (!ownerId) {
      return res
        .status(400)
        .json({ success: false, message: "Owner Id is required" });
    }

    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found, The pet required an existent owner",
      });
    }

    const pet = await Pet.create({ ...req.body });
    owner.pets.push(pet._id);
    await owner.save();

    res.status(201).json({
      success: true,
      message: "Pet register successfully and linked to owner",
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePet = async (req, res, next) => {
  try {
    const petId = req.params.id;
    if (req.body.owner) {
      const newOwner = await Owner.findById(req.body.owner);
      if (!newOwner) {
        return res.status(404).json({
          success: false,
          message: "El nuevo propietario no fue encontrado.",
        });
      }
    }

    const updatedPet = await Pet.findByIdAndUpdate(petId, req.body, {
      new: true,
      runValidators: true,
    }).populate("owner", "ownerName email phone");

    if (!updatedPet) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pet information updated successfully",
      data: updatedPet,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (req, res, next) => {
  try {
    const petId = req.params.id; 

    const petToDelete = await Pet.findById(petId);

    if (!petToDelete) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    } 
    const appointmentDeletionResult = await Appointment.deleteMany({
      pet: petId,
    }); 
    await Owner.findByIdAndUpdate(
      petToDelete.owner, 
      { $pull: { pets: petId } } 
    ); 

    const deletedPet = await Pet.findByIdAndDelete(petId);

    res.status(200).json({
      success: true,
      message: `Pet deleted successfully. Deleted: ${appointmentDeletionResult.deletedCount} Appointment(s).`,
      data: deletedPet,
    });
  } catch (error) {
    next(error);
  }
};
