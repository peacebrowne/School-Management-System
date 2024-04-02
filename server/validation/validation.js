import { getUserData, writeData } from "../repositories/repositories.js";
import { v4 as uuidv4 } from "uuid";
import { genSalt, hash } from "bcrypt";
import pkg from "validator";
const { isEmail, isEmpty, isStrongPassword } = pkg;

export default class Validations {
  signIn = async (data) => {
    const { email, password } = data;

    const result = await getUserData(email);

    if (!result) return;

    return result.email === email && result.password === password
      ? true
      : false;
  };

  signUp = async (data) => {
    const info = JSON.parse(data);

    const result = await getUserData(info.email);
    info["password"] = await hash(info.password, await genSalt());
    info["id"] = uuidv4();

    return result
      ? { msg: "User Already Exit!", status: false }
      : { msg: await writeData(info), status: true };
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

  valid_email = async (request, response) => {
    const email = request.body.email;

    response.send(
      !isEmail(email)
        ? `<div class="message text-sm py-2.5 rounded-lg flex danger"> <span class="mx-auto">Please enter a valid email address </span> </div>`
        : `<div class="message"></div>`
    );
  };

  valid_password = async (request, response) => {
    const password = request.body.password;

    response.send(
      !isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }) || isEmpty(password)
        ? `<div class="message text-sm py-2.5 rounded-lg flex danger"> <span class="mx-auto"> Invalid Password </span> </div>`
        : `<div class="message"></div>`
    );
  };
}
