import express from "express";

import { contactsController } from "../controllers";

export const contactsRouter = express.Router();

contactsRouter.post("/saveContact", contactsController.saveContact);
contactsRouter.get("/allContacts", contactsController.getAllContacts);
