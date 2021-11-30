import { Contacts } from "../models";
// @ts-ignore
import bcrypt from "bcrypt";
import { jwtService } from ".";

class ContactsService {
  checkUserExists(username: string) {
    return Contacts.count({ username: username });
  }

  async saveContact(username: string, email: string, password: string) {
    const salt = 10;
    const encodedPassword = bcrypt.hashSync(password, salt);
    const data = {
      username: username,
      email: email,
      password: encodedPassword,
    };
    // console.log(encodedPassword);
    
    await Contacts.insertMany([data]);
    const result = jwtService.createToken(username);
    return { result: result };
  }

  getAllContacts() {
    return Contacts.find({});
  }
}

export const contactsService = new ContactsService();
