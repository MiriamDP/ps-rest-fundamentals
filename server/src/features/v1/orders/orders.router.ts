import express from "express";
import { addOrderItems, deleteOrder, deleteOrderItem, getOrderDetail, getOrders, upsertOrder } from "./orders.service";
import { validate } from "../../../middleware/validation.middleware";
import { idItemIdUUIDRequestSchema, idUUIDRequestSchema, orderItemsDTORequestSchema, orderPOSTRequestSchema, orderPUTRequestSchema, pagingRequestSchema } from "../types";
import { OrdersPermissions, SecurityPermissions } from "../../../config/permissions";
import { checkRequiredScope } from "../../../middleware/auth.middleware";

export const ordersRouter = express.Router();

ordersRouter.get("/",checkRequiredScope(OrdersPermissions.Read),validate(pagingRequestSchema), async (req, res) => {
    const data=pagingRequestSchema.parse(req);
    const orders=await getOrders(data.query.skip,data.query.take);
    return res.json(orders);
});

ordersRouter.get("/:id",checkRequiredScope(OrdersPermissions.Read_Single),validate(idUUIDRequestSchema), async (req, res) => {
    const id = req.params.id;
    const order = await getOrderDetail(id);
    if (order != null) {
        res.json(order);
    } else {
        res.status(404).json({ message: "Order not found" });
    }
});

ordersRouter.post("/",checkRequiredScope(OrdersPermissions.Create),validate(orderPOSTRequestSchema),async(req,res)=>{
  const data=orderPOSTRequestSchema.parse(req);
  const order=await upsertOrder(data.body);
  if(order!=null){
    res.status(201).json(order);
  }else{
    res.status(500).json({message:"Creation failed"});
  }
});

ordersRouter.post("/:id/items",checkRequiredScope(OrdersPermissions.Create),validate(orderItemsDTORequestSchema),async(req,res)=>{
  const data=orderItemsDTORequestSchema.parse(req);
  const order=await addOrderItems(data.params.id, data.body);
  if(order!=null){
    res.status(201).json(order);
  }else{
    res.status(500).json({message:"Addition failed"});
  }
});

ordersRouter.delete("/:id",checkRequiredScope(SecurityPermissions.Deny),validate(idUUIDRequestSchema),async(req,res)=>{
  const id=idUUIDRequestSchema.parse(req).params.id;
  const item=await deleteOrder(id);
  if(item!=null){
    res.status(204).json({message:`Order ${id} deleted`});
  }else{
    res.status(404).json({message:"Order not found. Delete failed"});
  }
});

ordersRouter.delete("/:id/items/:itemId",checkRequiredScope(OrdersPermissions.Create),validate(idItemIdUUIDRequestSchema),async(req,res)=>{
  const data=idItemIdUUIDRequestSchema.parse(req);
  const order=await deleteOrderItem(data.params.id, data.params.itemId);
  if(order!=null){
    res.status(201).json(order);
  }else{
    res.status(500).json({message:"Order or Item nor found"});
  }
});

ordersRouter.put("/:id",checkRequiredScope(OrdersPermissions.Write),validate(orderPUTRequestSchema),async(req,res)=>{
  const data=orderPUTRequestSchema.parse(req);
  const orderData={customerId: "",...data.body};
  const order=await upsertOrder(orderData,data.params.id);
  if(order!=null){
    res.status(201).json(order);
  }else{
    res.status(500).json({message:"Update failed"});
  }
});
