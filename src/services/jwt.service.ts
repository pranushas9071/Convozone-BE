import { Response } from "express";
import jsonwebtoken from "jsonwebtoken";

class JwtService {
  createToken(username: string) {
    const secret_key = process.env.KEY;
    const data = {
      username: username,
    };
    const token = jsonwebtoken.sign(data, secret_key as string);
    return token;
  }
  verifyToken(token: string) {
    const secret_key = process.env.KEY;
    try {
      const decoded = jsonwebtoken.verify(token, secret_key as string);
      return { message: "success", data: decoded };
    } catch (err) {
      return { message: "failed", data: err };
    }
  }
}

export const jwtService = new JwtService();

export const jwtAuth = (req: any, res: Response, next: any) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const result = jwtService.verifyToken(token);
    if (result.message == "success") {
      req.decoded = result.data;
      next();
    } else {
      res
        .status(401)
        .send({ success: false, message: "Failed to authenticate token." });
    }
  } else {
    res.status(403).send({
      success: false,
      message: "No token provided.",
    });
  }
};
