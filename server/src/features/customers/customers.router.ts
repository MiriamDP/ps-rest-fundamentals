import express from "express";
import { getCustomerDetail, getCustomers, searchCustomers } from "./customers.service";
import { getOrdersForCustomer } from "../orders/orders.service";

export const customersRouter = express.Router();

customersRouter.get("/",async(req,res)=>{
  const customers=await getCustomers();
  res.json(customers);
});

customersRouter.get("/:id",async(req,res)=>{
  const id=req.params.id;
  const customer=await getCustomerDetail(id);
  if(customer!=null){
    res.json(customer);
  }else{
    res.status(404).json({message:"Customer not found"});
  }
});

customersRouter.get("/:id/orders", async(req,res)=>{
    const id=req.params.id;
    const orders=await getOrdersForCustomer(id);
    res.json(orders);
});
customersRouter.get("/search/:query", async(req,res)=>{
    const query=req.params.query;
    const customer=await searchCustomers(query);
    res.json(customer);
});