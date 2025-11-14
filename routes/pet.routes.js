import { Router } from "express";

const ownerRouter = Router();

ownerRouter.get("/", (req, res) => res.send({ title: "Get all pets" }));

ownerRouter.get("/:id", (req, res) =>
  res.send({ title: "Get pet by owner id" })
);

ownerRouter.post("/", (req, res) => res.send({ title: "Create pet " }));

ownerRouter.put("/:id/update", (req, res) =>
  res.send({ title: "Update pet information" })
);

ownerRouter.delete("/:id/delete", (req, res) =>
  res.send({ title: "pet deleted" })
);

export default ownerRouter;
