import { UserMessages } from "../models";

class UserService {
  saveMessage(username: string, message: string, timeStamp: Date, to: String) {
    const data = {
      username: username,
      message: message,
      timeStamp: timeStamp,
      to: to,
    };
    UserMessages.insertMany([data]);
  }

  getAllMessages(from: string, to: string) {
    return UserMessages.find({
      $or: [
        { $and: [{ username: from }, { to: to }] },
        { $and: [{ username: to }, { to: from }] },
      ],
    }).sort({ timestamp: 1 });
  }
}

export const userService = new UserService();
