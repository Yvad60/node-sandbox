import { Request, Response } from "express";
import path from "path";

export function getMessages(req: Request, res: Response) {
  res.render(path.join(__dirname, "..", "views", "messages.hbs"), {
    title: "Message for friend",
    friend: "Ivad Yves",
  });
}
