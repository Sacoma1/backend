import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  assignVeterinarian,
  createAppointment,
  deleteAppointment,
  getUnassignedAppointments,
  getUserAppointments,
} from "../controllers/appointment.controller.js";

const appointmentRouter = Router();

appointmentRouter.get("/", authorize, getUnassignedAppointments);

appointmentRouter.get("/user/:id", authorize, getUserAppointments);

appointmentRouter.post("/", authorize, createAppointment);

appointmentRouter.put("/:id/assign", authorize, assignVeterinarian);

appointmentRouter.delete("/:id", authorize, deleteAppointment);

export default appointmentRouter;
