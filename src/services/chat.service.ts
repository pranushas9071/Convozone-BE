import { UserMessages } from "../models";

class ChatService {
  saveMessage(username: string, message: string, timeStamp: Date, to: String) {
    const data = {
      username: username,
      message: message,
      timeStamp: timeStamp,
      to: to,
      state: "sent",
    };
    UserMessages.insertMany([data]);
  }

  updateMessageStateAsReceived(username: string, state: string) {
    return UserMessages.updateMany(
      { to: username, state: "sent" },
      { $set: { state: state } }
    );
  }

  updateMessageStateAsSeen(from: string, to: string, state: string) {
    return UserMessages.updateMany(
      {
        $or: [
          { $and: [{ to: to }, { username: from }, { state: "sent" }] },
          { $and: [{ to: to }, { username: from }, { state: "received" }] },
        ],
      },
      {
        $set: { state: state },
      }
    );
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
            {
              $group: {
                _id: "$username",
                lastTime: { $max: "$timeStamp" },
                lastMessage: { $last: "$message" },
              },
            },
          ],
          second: [
            { $match: { username: username } },
            {
              $group: {
                _id: "$to",
                lastTime: { $max: "$timeStamp" },
                lastMessage: { $last: "$message" },
              },
            },
          ],
          third: [
            { $match: { to: username, state: "received" } },
            { $group: { _id: "$username", newMessages: { $sum: 1 } } },
          ],
        },
      },
      {
        $project: {
          all: { $concatArrays: ["$first", "$second", "$third"] },
        },
      },
      { $unwind: "$all" },
      {
        $group: {
          _id: "$all._id",
          lastTime: { $max: "$all.lastTime" },
          newMessages: { $max: "$all.newMessages" },
          docs: {
            $push: {
              msg: "$all.lastMessage",
              time: "$all.lastTime",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          newMessages: 1,
          lastMessageDetails: {
            $filter: {
              input: "$docs",
              as: "doc",
              cond: {
                $eq: ["$$doc.time", "$lastTime"],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "ContactList",
          localField: "_id",
          foreignField: "username",
          pipeline: [{ $project: { dp: 1, lastActive: 1 } }],
          as: "result",
        },
      },
      {
        $sort: { "lastMessageDetails.time": -1 },
      },
    ]);
  }
}

export const chatService = new ChatService();
