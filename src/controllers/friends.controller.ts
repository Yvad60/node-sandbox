import { Request, Response } from "express";
import model from "../models/friends.model";

export function addFriend(req: Request, res: Response) {
  if (req.body.name == null) return res.status(400).json({ error: "Missing friend name" });
  const newFriend = {
    name: req.body.name,
    id: model.length + 1,
  };
  model.push(newFriend);
  res.status(201).json(newFriend);
}

export function getFriends(req: Request, res: Response) {
  res.status(200).json(model);
}
