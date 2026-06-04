import express from "express";
import { itemsRouter } from "./items/items.routerV2";
import { validatedAccessToken } from "../../middleware/auth.middleware";
import { customersRouter } from "../v1/customers/customers.router";
import { ordersRouter } from "../v1/orders/orders.router";

// register routes
export const v2Router = express.Router();

v2Router.use("/items", itemsRouter);

v2Router.use("/customers",validatedAccessToken, customersRouter);

v2Router.use("/orders",validatedAccessToken, ordersRouter);
