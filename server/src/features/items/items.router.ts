import express from "express";
import { deleteItem, getItemDetail, getItems, upsertItem } from "./items.service";
import { validate } from "../../middleware/validation.middleware";
import { idNumberRequestSchema, itemPOSTRequestSchema, itemPUTRequestSchema } from "../types";

export const itemsRouter = express.Router();

itemsRouter.get("/",async(req,res)=>{
  const items=await getItems();
  items.forEach((item)=>{
    item.imageUrl=buildImageUrl(req,item.id);
  });
  res.json(items);
});

itemsRouter.get("/:id",validate(idNumberRequestSchema),async(req,res)=>{
  const id=idNumberRequestSchema.parse(req).params.id;
  const item=await getItemDetail(id);
  if(item!=null){
    item.imageUrl=buildImageUrl(req, item.id);
    res.json(item);
  }else{
    res.status(404).json({message:"Item not found"});
  }
});

itemsRouter.post("/",validate(itemPOSTRequestSchema),async(req,res)=>{
  const data=itemPOSTRequestSchema.parse(req);
  const item=await upsertItem(data.body);
  if(item!=null){
    res.status(201).json(item);
  }else{
    res.status(500).json({message:"Creation failed"});
  }
});

itemsRouter.delete("/:id",validate(idNumberRequestSchema),async(req,res)=>{
  const id=idNumberRequestSchema.parse(req).params.id;
  const item=await deleteItem(id);
  if(item!=null){
    res.json(item);
  }else{
    res.status(404).json({message:"Item not found. Delete failed"});
  }
});

itemsRouter.put("/:id",validate(itemPUTRequestSchema),async(req,res)=>{
  const data=itemPUTRequestSchema.parse(req);
  const item=await upsertItem(data.body, data.params.id);
  if(item!=null){
    res.status(201).json(item);
  }else{
    res.status(500).json({message:"Update failed"});
  }
});


// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
function buildImageUrl(req: any, id: number): string {
  return `${req.protocol}://${req.get("host")}/images/${id}.jpg`;
}
