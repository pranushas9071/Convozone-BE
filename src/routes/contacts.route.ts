import express from "express";
import multer from "multer";
import  {upload}  from "../services";

import { contactsController } from "../controllers";

export const contactsRouter = express.Router();

contactsRouter.post("/register", contactsController.register);
contactsRouter.get("/allContacts", contactsController.getAllContacts);
contactsRouter.post("/login", contactsController.loginUser);
contactsRouter.get("/self", contactsController.getUserDetails);
contactsRouter.post(
  "/upload",
  upload.single("file"),
  contactsController.saveChanges
);
contactsRouter.post("/validate",contactsController.checkUserNameExists)