import mongoose from "mongoose";

const Schema = mongoose.Schema;

const contactsSchema = new Schema(
  {
    username: { type: Schema.Types.String },
    email: { type: Schema.Types.String },
    password: { type: Schema.Types.String },
    dp: { type: Schema.Types.String },
    status: { type: Schema.Types.String },
    dob: { type: Schema.Types.Date },
  }
);

contactsSchema.index({ username: 1 }, { unique: true });

export const Contacts = mongoose.model(
  "ContactList",
  contactsSchema,
  "ContactList"
);
