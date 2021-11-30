import express from "express";

import { userController } from "../controllers";

export const userRouter = express.Router();

// userRouter.get("/", new UserController().test);
userRouter.post("/saveMessage", userController.saveMessage);
userRouter.get("/allMessages", userController.getAllMessages);
