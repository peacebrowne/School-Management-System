import Validations from "../validation/validation.js";
import { Read, Create, Update, Delete } from "./handler.js";

const { readAll } = new Read();

const { signIn, valid_email, user_validation, class_validation } =
  new Validations();

export default class Controller {
  // Teacher controller for creating a new teacher
  create_teacher = async (request, response) => {
    const teacherData = request.body;
    const result = await new Create().createTeacher(teacherData);
    response.send(
      `<div class="message text-sm py-2.5 rounded-lg flex danger"> <span class="mx-auto"> ${result.msg} </span> </div>`
    );
  };

  // Student controller for creating a new student
  create_student = async (request, response) => {
    const studentData = request.body;

    const classData = await class_validation(studentData.class_name);

    if (!classData.status) {
      response.send(
        `<div class="message text-sm py-2.5 rounded-lg flex danger"> <span class="mx-auto">
          ${classData.msg}
        </span> </div>`
      );
    }

    delete classData.status;
    delete studentData.class_name;

    const result = await new Create().createStudent({
      ...studentData,
      ...classData,
    });
    response.send(
      `<div class="message text-sm py-2.5 rounded-lg flex danger"> <span class="mx-auto"> 
        ${result.msg} 
      </span> </div>`
    );
  };

  // Parent controller for creating a new parent
  create_parent = async (request, response) => {
    const parentData = request.body;
    const result = await new Create().createParents(parentData);
    response.send(
      `<div class="message text-sm py-2.5 rounded-lg flex danger"> <span class="mx-auto"> ${result.msg} </span> </div>`
    );
  };

  // Parent controller for updating a parent
  update_parent = async (request, response) => {
    const parentData = request.body;
    const result = await new Update().updateParent(parentData);
    response.send(
      `<div class="message text-sm py-2.5 rounded-lg flex danger"> <span class="mx-auto"> ${result.msg} </span> </div>`
    );
  };

  // Employee controller for creating a new employee
  create_employee = async (request, response) => {
    const employeeData = request.body;

    const result = await new Create().createEmployee(employeeData);
    response.send(
      `<div class="message text-sm py-2.5 rounded-lg flex danger"> <span class="mx-auto"> ${result.msg} </span> </div>`
    );
  };

  // Employee controller for updating an employee.
  update_employee = async (request, response) => {
    const employeeData = request.body;
    const result = await new Update().updateEmployee(employeeData);
    response.send(
      `<div class="message text-sm py-2.5 rounded-lg flex danger"> <span class="mx-auto"> ${result.msg} </span> </div>`
    );
  };

  // Employee controller for deleting an employee.
  delete_employee = async (request, response) => {
    const employeeData = request.body;
    const result = await new Update().deleteEmployee(employeeData);
    response.send(
      `<div class="message text-sm py-2.5 rounded-lg flex danger"> <span class="mx-auto"> ${result.msg} </span> </div>`
    );
  };

  // User controller for creating a new user
  create_user = async (request, response) => {
    const userData = request.body;

    const { email, password } = userData;

    const userExist = await user_validation(email);

    if (!userExist.status)
      return response.send(
        `<div class="message text-sm py-2.5 rounded-lg flex danger> <span class="mx-auto"> ${userExist.msg} </span> </div>`
      );

    const result = await new Create().createUser(userData);

    response.send(
      `<div class="message text-sm py-2.5 rounded-lg flex danger> <span class="mx-auto"> ${result.msg} </span> </div>`
    );
  };

  // User controller for deleting users
  delete_user = async (request, response) => {
    const userData = request.body;

    const result = await new Delete().deleteUser(userData);

    response.send(
      `<div class="message text-sm py-2.5 rounded-lg flex danger> <span class="mx-auto"> ${result.msg} </span> </div>`
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
