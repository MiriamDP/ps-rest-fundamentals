import express from "express";
import { getItemDetail, getItems } from "./items.service";
import { validate } from "../../middleware/validation.middleware";
import { idNumberRequestSchema } from "../types";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
function buildImageUrl(req: any, id: number): string {
  return `${req.protocol}://${req.get("host")}/images/${id}.jpg`;
}
