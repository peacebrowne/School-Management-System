import Validations from "./server/validation/validation.js";
const { signIn, valid_email } = new Validations();

export default class Handler {
  login_get = async (request, response) => {
    response.render("login", {
      title: "Log In",
    });
  };

  login_post = async (request, response) => {
    const { email, password } = JSON.parse(request.body);
    console.log(email, password);

    return;

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

  admin_dashboard = async (request, response) => {
    response.render("dashboard", {
      title: "Admin Dashboard",
    });
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
