import { Contacts } from "../models";
// @ts-ignore
import bcrypt from "bcrypt";
import { jwtService } from ".";

class ContactsService {
  checkUserExists(username: string) {
    return Contacts.findOne({ username: username });
  }

  async register(username: string, email: string, password: string) {
    const salt = 10;
    const encodedPassword = bcrypt.hashSync(password, salt);
    const data = {
      username: username,
      email: email,
      password: encodedPassword,
    };

    await Contacts.insertMany([data]);
    const result = jwtService.createToken(username);
    return { result: result };
  }

  async loginUser(username: string, password: string) {
    const data = await this.checkUserExists(username);

    if (data == null) {
      return { result: "No user found" };
    } else {
      const comparisonResult = bcrypt.compareSync(password, data.password);
      if (comparisonResult) {
        const result = jwtService.createToken(username);
        return { result: result };
      } else return { result: "Incorrect password" };
    }
  }

  getAllContacts(from: string) {
    return Contacts.find(
      { username: { $nin: [from] } },
      { username: 1, dp: 1, status: 1 }
    );
  }

  getUserDetails(username: string) {
    return Contacts.findOne({ username: username }, { password: 0 });
  }

  saveChanges(
    username: string,
    file: string,
    email: string,
    dob: string,
    status: string
  ) {
    return Contacts.updateOne(
      { username: username },
      { $set: { dp: file, email: email, dob: dob, status: status } }
    );
  }
}

export const contactsService = new ContactsService();
