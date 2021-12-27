import express from "express";
import { contactsController } from "../controllers";
import { upload } from "../services";

export const contactsRouter = express.Router();

contactsRouter.post("/register", contactsController.register);
contactsRouter.get("/allContacts", contactsController.getAllContacts);
contactsRouter.post("/login", contactsController.loginUser);
contactsRouter.get("/self", contactsController.getUserDetails);
contactsRouter.put(
  "/upload",
  upload.single("file"),
  contactsController.saveChanges
);
contactsRouter.post("/validate", contactsController.checkUserNameExists);
contactsRouter.post("/lastActive", contactsController.updateLastActiveState);
