import { Router } from "express";
import dummyData from "../data.js";


const searchRouter = Router();

searchRouter.get("/", (req, res) => {
  const { filter, value } = req.query;

  if (!filter && !value) {
    return res.send(dummyData);
  }

  const results = dummyData.filter((item) => {
    const fieldContent = item[filter];

    if (fieldContent) {
      const contentStr = String(fieldContent).toLowerCase();
      const valueStr = String(value).toLowerCase();

      return contentStr.includes(valueStr);
    }
    return false;
  });
  return res.json(results);
});
