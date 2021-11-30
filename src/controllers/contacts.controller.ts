import { Request, Response } from "express";
import { contactsService } from "../services";

class ContactsController {
  async saveContact(req: Request, res: Response) {
    // const data = await contactsService.checkUserExists(req.body.username);
    // if (data != 0) {
    //   res.send({ result: "User already exists" });
    // } else {
    const result = await contactsService.saveContact(
      req.body.username,
      req.body.email,
      req.body.password
    );
    res.send(result);
    // }

    // new Promise((res, rej) => {
    //   if (data != 0) {
    //     rej({ result: "User already exists" });
    //   } else {
    //     contactsService.saveContact(
    //       req.body.username,
    //       req.body.email,
    //       req.body.password
    //     );
    //     res({ result: "User saved successfully" });
    //   }
    // })
    //   .then((result) => {
    //     res.send(result);
    //   })
    //   .catch((result) => {
    //     res.send(result);
    //   });
  }

  async getAllContacts(req: Request, res: Response) {
    const data = await contactsService.getAllContacts();
    res.send(data);
  }
}

export const contactsController = new ContactsController();
