import express from "express";
import multer from "multer";

import { contactsController } from "../controllers";

export const contactsRouter = express.Router();

contactsRouter.post("/register", contactsController.register);
contactsRouter.get("/allContacts", contactsController.getAllContacts);
contactsRouter.post("/login", contactsController.loginUser);
contactsRouter.get("/self", contactsController.getUserDetails);

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "C:/Users/pranusha.sivasamy/Documents/GitHub/convozone-backend/src/assets");
  },
  filename: (req, file, cb) => {
    const file_name = Date.now() + " "+ file.originalname;
    cb(null, file_name);
  },
});

const upload = multer({ storage: fileStorage });

contactsRouter.post(
  "/upload",
  upload.single("file"),
  contactsController.saveChanges
);
