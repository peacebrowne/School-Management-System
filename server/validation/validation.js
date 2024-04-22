import Interactions from "../repositories/repositories.js";
import { v4 as uuidv4 } from "uuid";
import { genSalt, hash } from "bcrypt";
import pkg from "validator";
import { Read } from "../controller/handler.js";
const { isEmail, isEmpty, isStrongPassword } = pkg;

export default class Validations {
  signIn = async (data) => {
    const { email, password } = data;

    const result = await new Interactions("person", "read").readData(email);

    if (!result) return;

    return result?.email === email && result?.password === password
      ? true
      : false;
  };

  user_validation = async (email) => {
    if (!isEmail(email))
      return {
        msg: "Invalid email, please enter a valid email",
        status: false,
      };

    const userEmail = await new Read().readValue("person", ["email"], {
      email: email,
    });

    if (!userEmail) {
      return {
        msg: "Email address, doesn't exist",
        status: false,
      };
    }

    const userExists = await new Read().readValue("users", ["email"], {
      email: email,
    });

    return userExists
      ? { msg: "User Already Exit!", status: false }
      : {
          status: true,
        };
  };

  class_validation = async (class_name) => {
    const classes = await new Read().readValue(
      "classes",
      ["id", "max_strength"],
      {
        name: class_name,
      }
    );

    const { id, max_strength } = classes;

    return max_strength
      ? { class_name: id, max_strength, status: true }
      : { msg: `No seat available for class ${class_name}`, status: false };
  };

  resetPassword = async (mail) => {
    const info = JSON.parse(mail);
    const result = await getUserData(info.email);

    return result
      ? this.emailUser(info.email)
      : {
          msg: "There is no account with that email address.",
          status: false,
        };
  };
}
