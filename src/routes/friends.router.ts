import { Router } from "express";
import { addFriend, getFriends } from "../controllers/friends.controller";

const friendsRouter = Router();

friendsRouter.post("/", addFriend);
friendsRouter.get("/", getFriends);

export default friendsRouter
