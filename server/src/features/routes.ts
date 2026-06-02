import express from "express";
import { itemsRouter } from "./items/items.router";
import { customersRouter } from "./customers/customers.router";
import { ordersRouter } from "./orders/orders.router";
import { validatedAccessToken } from "../middleware/auth.middleware";

// register routes
const apiRouter = express.Router();

apiRouter.use("/items", itemsRouter);

apiRouter.use("/customers",validatedAccessToken, customersRouter);

apiRouter.use("/orders",validatedAccessToken, ordersRouter);

export const routes = express.Router();
routes.use("/api", apiRouter);
routes.get("/", (req, res) => {
  res.status(200).send("<h1>Server is ready!</h1>");
});
