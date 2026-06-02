import express from "express";
import { addOrderItems, deleteOrder, deleteOrderItem, getOrderDetail, getOrders, upsertOrder } from "./orders.service";
import { validate } from "../../middleware/validation.middleware";
import { idItemIdUUIDRequestSchema, idUUIDRequestSchema, orderItemsDTORequestSchema, orderPOSTRequestSchema, pagingRequestSchema } from "../types";

export const ordersRouter = express.Router();

ordersRouter.get("/",validate(pagingRequestSchema), async (req, res) => {
    const data=pagingRequestSchema.parse(req);
    const orders=await getOrders(data.query.skip,data.query.take);
    return res.json(orders);
});

ordersRouter.get("/:id",validate(idUUIDRequestSchema), async (req, res) => {
    const id = req.params.id;
    const order = await getOrderDetail(id);
    if (order != null) {
        res.json(order);
    } else {
        res.status(404).json({ message: "Order not found" });
    }
});

ordersRouter.post("/",validate(orderPOSTRequestSchema),async(req,res)=>{
  const data=orderPOSTRequestSchema.parse(req);
  const order=await upsertOrder(data.body);
  if(order!=null){
    res.status(201).json(order);
  }else{
    res.status(500).json({message:"Creation failed"});
  }
});

ordersRouter.post("/:id/items",validate(orderItemsDTORequestSchema),async(req,res)=>{
  const data=orderItemsDTORequestSchema.parse(req);
  const order=await addOrderItems(data.params.id, data.body);
  if(order!=null){
    res.status(201).json(order);
  }else{
    res.status(500).json({message:"Addition failed"});
  }
});

ordersRouter.delete("/:id",validate(idUUIDRequestSchema),async(req,res)=>{
  const id=idUUIDRequestSchema.parse(req).params.id;
  const item=await deleteOrder(id);
  if(item!=null){
    res.status(204).json({message:`Order ${id} deleted`});
  }else{
    res.status(404).json({message:"Order not found. Delete failed"});
  }
});

ordersRouter.delete("/:id/items/:itemId",validate(idItemIdUUIDRequestSchema),async(req,res)=>{
  const data=idItemIdUUIDRequestSchema.parse(req);
  const order=await deleteOrderItem(data.params.id, data.params.itemId);
  if(order!=null){
    res.status(201).json(order);
  }else{
    res.status(500).json({message:"Order or Item nor found"});
  }
});
