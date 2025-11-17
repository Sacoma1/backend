import express from "express";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import searchRouter from "./routes/search.route.js";
import userRouter from "./routes/user.routes.js";

import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middlewares/arject.middleware.js";
import appointmentRouter from "./routes/appointment.routes.js";
import ownerRouter from "./routes/owner.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/owner", ownerRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/appointments", appointmentRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Bienvenido a la app de administracion veterinaria");
});

app.listen(PORT, async () => {
  console.log(`server administrativo corriendo en http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
