import { v4 as uuidv4 } from "uuid";
import Interactions from "../server/repositories/repositories.js";

const { writeData, readData, updateData } = new Interactions();

class Create {
  createEmployee(data) {
    const id = uuidv4();

    const person_id = this.createPerson({
      first_name: data.first_name,
      middle_name: data?.middle_name ?? "",
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      place_of_birth: data?.place_of_birth ?? "",
      gender: data.gender,
      city: data?.city,
      address: data?.address,
      full_name: `${data.first_name} ${data?.middle_name ?? ""} ${
        data.last_name
      }`,
    });

    const { columns, values, params } = handleCreate({
      id: id,
      departments: data.departments ?? "",
      salary: data.salary ?? "",
      employee_type: data.employee_type ?? "",
      person_id: person_id,
    });

    writeData("employees", { columns, values, params });

    this.createRole({
      employee_id: id,
      role: data?.role,
    });

    return data.id;
  }

  createPerson(data) {
    const id = uuidv4();
    data.id = id;

    const { columns, values, params } = handleCreate(data);

    writeData("person", { columns, values, params });

    return id;
  }

  createRole(data) {
    const id = uuidv4();
    data.id = id;
    const { columns, values, params } = handleCreate(data);
    writeData("roles", { columns, values, params });
  }

  createTeacher(data) {
    const id = uuidv4();
  }
  createUser() {}

  createStudent() {}
}

class Read {
  async readAll(table, fields, filters, joinTables, joinConditions) {
    const data = await readData(table, {
      fields,
      filters,
      joinTables,
      joinConditions,
    });
  }
  async readEmployee(fields, filters) {
    const data = await readData("employees", {
      fields,
      filters,
    });
  }

  async readPerson(fields, filters) {
    const data = await readData("person", {
      fields,
      filters,
    });
  }

  async readRoles(fields, filters) {
    const data = await readData("roles", {
      fields,
      filters,
    });
    console.log(data);
  }
}

class Update {
  updateEmployee(fields, values, filters) {
    updateData("employees", { fields, values, filters });
  }
}

const handleCreate = (data) => {
  const columns = Object.keys(data).join(", ");
  const values = Object.keys(data)
    .map(() => "?")
    .join(", ");

  const params = Object.values(data);
  return { columns, values, params };
};

// new Update().updateEmployee(["full_name"], ["Andrew Anderson"], {
//   id: "445b158c-3428-4b28-bdf0-9d3b23e324e4",
// });

// new Read().readPerson(["id", "full_name", "date_of_birth", "gender"], {
//   id: "9cba3994-f442-48fe-82e4-6c4c018ed7bb",
// });

// new Read().readAll(
//   "person",
//   ["person.id AS person_id", "full_name", "date_of_birth", "gender"],
//   {
//     "employees.id": "445b158c-3428-4b28-bdf0-9d3b23e324e4",
//     role: "Administrator",
//   },
//   ["employees", "roles"],
//   {
//     employees: "person.id = employees.person_id",
//     roles: "employees.id = roles.employee_id",
//   }
// );

// new Create().createEmployee({
//   departments: "Accounting",
//   salary: 80000.0,
//   employee_type: "Part-time",
//   first_name: "Musu",
//   last_name: "Doe",
//   date_of_birth: "1990-05-10",
//   place_of_birth: "Paynesville",
//   gender: "Female",
//   city: "Paynesville",
//   address: "789 ELWA Community",
//   full_name: "John Doe",
//   role: "Accountant Manager",
// });

export { Create, Read };
