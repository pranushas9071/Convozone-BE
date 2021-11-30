import mongoose from "mongoose";

const Schema = mongoose.Schema;

const contactsSchema = new Schema(
  {
    username: { type: Schema.Types.String, index: true },
    email: { type: Schema.Types.String },
    password: { type: Schema.Types.String },
  },
  { strict: true }
);

contactsSchema.index({ username: 1 }, { unique: true });

export const Contacts = mongoose.model(
  "ContactList",
  contactsSchema,
  "ContactList"
);
