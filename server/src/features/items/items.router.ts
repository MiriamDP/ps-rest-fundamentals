import express from "express";
import { deleteItem, getItemDetail, getItems, upsertItem } from "./items.service";
import { validate } from "../../middleware/validation.middleware";
import { idNumberRequestSchema, itemPOSTRequestSchema, itemPUTRequestSchema } from "../types";
import { create } from "xmlbuilder2";
import { validatedAccessToken } from "../../middleware/auth.middleware";

export const itemsRouter = express.Router();

itemsRouter.get("/",async(req,res)=>{
  const items=await getItems();
  items.forEach((item)=>{
    item.imageUrl=buildImageUrl(req,item.id);
  });
  if(req.headers["accept"]=="application/xml"){
    const root=create().ele("items");
    items.forEach((i)=>{
      root.ele("item",i);
    });
    res.status(200).send(root.end({prettyPrint: true}));
  }
  res.json(items);
});

itemsRouter.get("/:id",validate(idNumberRequestSchema),async(req,res)=>{
  const id=idNumberRequestSchema.parse(req).params.id;
  const item=await getItemDetail(id);
  if(item!=null){
    item.imageUrl=buildImageUrl(req, item.id);
    if(req.headers["accept"]=="application/xml"){
      res.status(200).send(create().ele("item",item).end());
    }
  }else{
    if(req.headers["accept"]=="application/xml"){
      res.status(404).send(create().ele("error",{message:"Item Not Found"}).end());
    }
    res.status(404).json({message:"Item not found"});
  }
});

itemsRouter.post("/",validatedAccessToken,validate(itemPOSTRequestSchema),async(req,res)=>{
  const data=itemPOSTRequestSchema.parse(req);
  const item=await upsertItem(data.body);
  if(item!=null){
    if(req.headers["accept"]=="application/xml"){
      res.status(201).send(create().ele("item",item).end());
    }
    res.status(201).json(item);
  }else{
    if(req.headers["accept"]=="application/xml"){
      res.status(500).send(create().ele("error",{message:"Creation failed"}).end());
    }
    res.status(500).json({message:"Creation failed"});
  }
});

itemsRouter.delete("/:id",validatedAccessToken,validate(idNumberRequestSchema),async(req,res)=>{
  const id=idNumberRequestSchema.parse(req).params.id;
  const item=await deleteItem(id);
  if(item!=null){
    res.json(item);
  }else{
    res.status(404).json({message:"Item not found. Delete failed"});
  }
});

itemsRouter.put("/:id",validatedAccessToken,validate(itemPUTRequestSchema),async(req,res)=>{
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
