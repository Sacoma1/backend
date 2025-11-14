import { Router } from "express";

const ownerRouter = Router();

ownerRouter.get("/", (req, res) => res.send({ title: "Get all users" }));

ownerRouter.get("/:id", (req, res) =>
  res.send({ title: "Get user by owner id" })
);

ownerRouter.post("/", (req, res) => res.send({ title: "Create owner" }));

ownerRouter.put("/:id/update", (req, res) =>
  res.send({ title: "Update owner information" })
);

ownerRouter.delete("/:id/delete", (req, res) =>
  res.send({ title: "Owner deleted" })
);

export default ownerRouter;
