import { Router } from "express";
import item from "./item.middleware.js";

const route = Router();

route.get("/", item.get, (req, res) => res.status(200).json(res.locals.items));

route.post("/", item.create, item.get, (req, res) =>
  res.status(200).json(res.locals.items)
);

route.delete("/", item.delete, item.get, (req, res) =>
  res.status(200).json(res.locals.items)
);

export default route;
