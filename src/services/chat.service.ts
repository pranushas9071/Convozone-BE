import { UserMessages } from "../models";

class ChatService {
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
    }).sort({ timeStamp: 1 });
  }

  chatDetails(username: string) {
    return UserMessages.aggregate([
      {
        $facet: {
          first: [
            { $match: { to: username } },
            { $group: { _id: "$username", lastTime: { $max: "$timeStamp" } } },
          ],
          second: [
            { $match: { username: username } },
            { $group: { _id: "$to", lastTime: { $max: "$timeStamp" } } },
          ],
        },
      },
      {
        $project: {
          all: { $concatArrays: ["$first", "$second"] },
        },
      },
      { $unwind: "$all" },
      { $group: { _id: "$all._id", lastTime: { $max: "$all.lastTime" } } },
      {
        $lookup: {
          from: "ContactList",
          localField: "_id",
          foreignField: "username",
          pipeline:[{$project:{dp:1}}],
          as: "result",
        },
      },
    ]);
  }
}

export const chatService = new ChatService();
