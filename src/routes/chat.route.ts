import express from "express";

import { chatController } from "../controllers";

export const chatRouter = express.Router();

chatRouter.post("/message", chatController.saveMessage);
chatRouter.get("/allMessages", chatController.getAllMessages);
chatRouter.get("/allChatDetails", chatController.chatDetails);
