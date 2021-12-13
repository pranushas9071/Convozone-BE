import { Request, Response } from "express";
import { chatService } from "../services";

class ChatController {
  saveMessage(req: Request, res: Response) {
    chatService.saveMessage(
      req.body.username,
      req.body.message,
      req.body.timeStamp,
      req.body.to
    );
    res.send({ status: "message saved" });
  }

  async getAllMessages(req: any, res: Response) {
    const data = await chatService.getAllMessages(
      req.decoded.username,
      req.query.to
    );
    res.send(data);
  }

  async chatDetails(req: any, res: Response) {
    const data = await chatService.chatDetails(req.decoded.username);
    res.send(data);
  }
}

export const chatController = new ChatController();
