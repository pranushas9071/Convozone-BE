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
    if (req.file) {
      const result = await contactsService.saveChanges(
        req.decoded.username,
        req.file.filename,
        req.body
      );
      res.send({ message: "Uploaded successfuly" });
    } else {
      const result = await contactsService.saveChanges(
        req.decoded.username,
        "",
        req.body
      );
      res.send({ message: "Uploaded successfuly" });
    }
  }

  async checkUserNameExists(req: Request, res: Response) {
    if (typeof req.body.username == "string") {
      const data = await contactsService.checkUserNameExists(req.body.username);
      if (data > 0) res.send({ usernameTaken: true });
      else res.send({ usernameTaken: false });
    }
  }

  async updateLastActiveState(req: any, res: Response) {
    const data = await contactsService.updateLastActiveState(
      req.decoded.username,
      req.body.lastActive
    );
    res.send({ message: "Updated successfully" });
  }
}

export const contactsController = new ContactsController();
