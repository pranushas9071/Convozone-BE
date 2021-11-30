import { Request, Response } from "express";
import { userService } from "../services";

class UserController {
  // test(req: Request, res: Response) {
  //   // res.sendFile("C:/Users/pranusha.sivasamy/Documents/GitHub/ConvoZone/src/html/index.html");
  //   res.send("hello");
  // }

  saveMessage(req: Request, res: Response) {
    userService.saveMessage(
      req.body.username,
      req.body.message,
      req.body.timeStamp,
      req.body.to
    );
    res.send({ status: "message saved" });
  }

  async getAllMessages(req: Request, res: Response) {
    if (typeof req.query.from == "string" && typeof req.query.to == "string") {
      const data = await userService.getAllMessages(
        req.query.from,
        req.query.to
      );
      res.send(data);
    }
  }
}

export const userController = new UserController();
