import express from "express";
import { itemsRouter } from "./items/items.router";
import { validatedAccessToken } from "../../middleware/auth.middleware";
import { customersRouter } from "./customers/customers.router";
import { ordersRouter } from "./orders/orders.router";

// register routes
export const v1Router = express.Router();


v1Router.use("/items", itemsRouter // #swagger.tags=["Items"]
);

v1Router.use("/customers",validatedAccessToken, customersRouter // #swagger.tags=["Customers"]
);

v1Router.use("/orders",validatedAccessToken, ordersRouter // #swagger.tags=["Orders"]
);
