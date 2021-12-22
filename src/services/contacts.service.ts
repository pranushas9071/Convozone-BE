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
    await Contacts.collection.insertOne(data);
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
      { username: 1, dp: 1, status: 1, lastActive: 1 }
    );
  }

  getUserDetails(username: string) {
    return Contacts.findOne({ username: username }, { password: 0 });
  }

  saveChanges(username: string, file: string, data: any) {
    let updates;
    if (file != "") {
      updates = {
        dp: file,
        email: data.email,
        dob: data.dob,
        status: data.status,
      };
    } else {
      updates = {
        email: data.email,
        dob: data.dob,
        status: data.status,
      };
    }
    return Contacts.updateOne({ username: username }, { $set: updates });
  }

  checkUserNameExists(username: string) {
    return Contacts.countDocuments({ username: username });
  }

  updateLastActiveState(username: string, time: string) {
    return Contacts.updateOne(
      { username: username },
      { $set: { lastActive: time } }
    );
  }
}

export const contactsService = new ContactsService();
