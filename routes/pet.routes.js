import { Router } from "express";

const petRouter = Router();

petRouter.get("/", (req, res) => res.send({ title: "Get all pets" }));

petRouter.get("/:id", (req, res) => res.send({ title: "Get pet by owner id" }));

petRouter.post("/", (req, res) => res.send({ title: "Create pet " }));

petRouter.put("/:id/update", (req, res) =>
  res.send({ title: "Update pet information" })
);

petRouter.delete("/:id/delete", (req, res) =>
  res.send({ title: "pet deleted" })
);

export default ownerRouter;
