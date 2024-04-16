import Validations from "../validation/validation.js";
import { Read, Create } from "./handler.js";

const { readAll } = new Read();

const { signIn, valid_email } = new Validations();

export default class Controller {
  create_student = async (request, response) => {
    const studentData = request.body;
    const result = await new Create().createStudent(studentData);
    response.send(
      `<div class="message text-sm py-2.5 rounded-lg flex danger"> <span class="mx-auto"> ${result.msg} </span> </div>`
    );
  };

  create_guardian = async (request, response) => {
    const guardianData = request.body;
    const result = await new Create().createGuardians(guardianData);
    response.send(
      `<div class="message text-sm py-2.5 rounded-lg flex danger"> <span class="mx-auto"> ${result.msg} </span> </div>`
    );
  };

  admin_dashboard = async (request, response) => {
    const students = await readAll("students");
    const teachers = await readAll("teachers");

    response.render("dashboard", {
      title: "Admin Dashboard",
      total_collections: "75,000",
      fee_collections: "15,000",
      card: {
        students: students.length,
        teachers: teachers.length,
      },
    });
  };

  login_get = async (request, response) => {
    console.log(request.body);
    response.render("login", {
      title: "Log In",
    });
  };

  login_post = async (request, response) => {
    const { email, password } = request.body;

    if (!valid_email(email))
      return response
        .status(401)
        .send(
          `<div class="message text-sm py-2.5 rounded-lg flex danger"> <span class="mx-auto">Wrong email or password</span> </div>`
        );

    const user = await signIn({ email, password });

    if (!user)
      return response.send(
        `<div class="message text-sm py-2.5 rounded-lg flex danger"> <span class="mx-auto">Wrong email or password</span> </div>`
      );

    const key = user["role"];

    const dashboard = new Dashboard();
    const chosen = dashboard[key] || dashboard.default;

    response.redirect(`/admin/${chosen}`);
  };
}

class Dashboard {
  administrator = () => {
    return "dashboard";
  };

  teacher = () => {
    return "Teacher Dashboard";
  };

  default = () => {
    return "Whoops Not Found!";
  };
}
