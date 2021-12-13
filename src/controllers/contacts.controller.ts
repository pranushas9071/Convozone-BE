import { Request, Response } from "express";
import { contactsService } from "../services";

class ContactsController {
  async register(req: Request, res: Response) {
    const result = await contactsService.register(
      req.body.username,
      req.body.email,
      req.body.password
    );
    res.send(result);
  }

  async getAllContacts(req: any, res: Response) {
    const data = await contactsService.getAllContacts(req.decoded.username);
    res.send(data);
  }

  async loginUser(req: Request, res: Response) {
    const result = await contactsService.loginUser(
      req.body.username,
      req.body.password
    );
    res.send(result);
  }

  async getUserDetails(req: any, res: Response) {
    const data = await contactsService.getUserDetails(req.decoded.username);
    res.send(data);
  }

  async saveChanges(req: any, res: Response) {
    const result = await contactsService.saveChanges(
      req.decoded.username,
      req.file.filename,
      req.body.email,
      req.body.dob,
      req.body.status
    );
    res.send({ message: "Uploaded successfuly" });
  }
}

export const contactsController = new ContactsController();
