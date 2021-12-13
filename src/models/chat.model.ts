import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userMessageSchema = new Schema({
  username: { type: Schema.Types.String },
  message: { type: Schema.Types.String },
  timeStamp: { type: Schema.Types.Date },
  to: { type: Schema.Types.String },
});

export const UserMessages = mongoose.model(
  "UserMessages",
  userMessageSchema,
  "UserMessages"
);
