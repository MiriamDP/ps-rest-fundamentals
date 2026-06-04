import express from "express";
import { deleteCustomer, getCustomerDetail, getCustomers, searchCustomers, upsertCustomer } from "./customers.service";
import { getOrdersForCustomer } from "../orders/orders.service";
import { validate } from "../../../middleware/validation.middleware";
import { customerPOSTRequestSchema, customerPUTRequestSchema, idNumberRequestSchema, idUUIDRequestSchema } from "../types";
import { CustomersPermissions, SecurityPermissions } from "../../../config/permissions";
import { checkRequiredScope } from "../../../middleware/auth.middleware";

export const customersRouter = express.Router();

customersRouter.get("/",checkRequiredScope(CustomersPermissions.Read),async(req,res)=>{
  const customers=await getCustomers();
  res.json(customers);
});

customersRouter.get("/:id",checkRequiredScope(CustomersPermissions.Read_Single),validate(idUUIDRequestSchema),async(req,res)=>{
  const id=idUUIDRequestSchema.parse(req).params.id;
  const customer=await getCustomerDetail(id);
  if(customer!=null){
    res.json(customer);
  }else{
    res.status(404).json({message:"Customer not found"});
  }
});

customersRouter.get("/:id/orders", checkRequiredScope(CustomersPermissions.Read_Order),checkRequiredScope(CustomersPermissions.Read),async(req,res)=>{
    const id=req.params.id;
    const orders=await getOrdersForCustomer(id);
    res.json(orders);
});

customersRouter.get("/search/:query",checkRequiredScope(CustomersPermissions.Read), async(req,res)=>{
    const query=req.params.query;
    const customer=await searchCustomers(query);
    res.json(customer);
});

customersRouter.post("/",checkRequiredScope(CustomersPermissions.Create),validate(customerPOSTRequestSchema),async(req,res)=>{
  const data=customerPOSTRequestSchema.parse(req);
  const customer=await upsertCustomer(data.body);
  if(customer!=null){
    res.status(201).json(customer);
  }else{
    res.status(500).json({message:"Creation failed"});
  }
});

customersRouter.delete("/:id",checkRequiredScope(SecurityPermissions.Deny),validate(idUUIDRequestSchema),async(req,res)=>{
  const id=idUUIDRequestSchema.parse(req).params.id;
  const item=await deleteCustomer(id);
  if(item!=null){
    res.status(204);
  }else{
    res.status(404).json({message:"Customer not found. Delete failed"});
  }
});

customersRouter.put("/:id",checkRequiredScope(CustomersPermissions.Write),validate(customerPUTRequestSchema),async(req,res)=>{
  const data=customerPUTRequestSchema.parse(req);
  const customer=await upsertCustomer(data.body, data.params.id);
  if(customer!=null){
    res.status(201).json(customer);
  }else{
    res.status(500).json({message:"Update failed"});
  }
});