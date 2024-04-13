import { v4 as uuidv4 } from "uuid";
import Interactions from "../repositories/repositories.js";

const { writeData, readData, updateData } = new Interactions();

class Create {
  async createEmployee(data) {
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
      nationality: data?.nationality,
      full_name: `${data.first_name} ${data?.middle_name ?? ""} ${
        data.last_name
      }`,
    });

    const { columns, values, params } = handleCreate({
      id: id,
      departments: data?.departments ?? "",
      salary: data?.salary ?? "",
      employee_type: data?.employee_type ?? "",
      person_id: person_id,
    });

    writeData("employees", { columns, values, params });

    return id;
  }

  async createPerson(data) {
    const id = uuidv4();
    data.id = id;

    const { columns, values, params } = handleCreate(data);

    writeData("person", { columns, values, params });

    return id;
  }

  async createTeacher(data) {
    const id = uuidv4();

    const employee_id = this.createEmployee({
      first_name: data.first_name,
      middle_name: data?.middle_name ?? "",
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      place_of_birth: data?.place_of_birth ?? "",
      gender: data.gender,
      city: data?.city,
      address: data?.address,
      nationality: data?.nationality,
      full_name: `${data.first_name} ${data?.middle_name ?? ""} ${
        data.last_name
      }`,
    });

    const { columns, values, params } = handleCreate({
      id: id,
      employee_id: employee_id,
    });

    writeData("teachers", { columns, values, params });

    return id;
  }

  async createStudent(data) {
    const id = uuidv4();

    const person_id = await this.createPerson({
      first_name: data.first_name,
      middle_name: data?.middle_name ?? "",
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      place_of_birth: data?.place_of_birth ?? "",
      gender: data.gender,
      city: data?.city,
      address: data?.address ?? "",
      nationality: data?.nationality,
      full_name: `${data.first_name} ${data?.middle_name ?? ""} ${
        data.last_name
      }`,
    });

    const { columns, values, params } = handleCreate({
      id: id,
      person_id: person_id,
    });

    writeData("students", { columns, values, params });
    return id;
  }

  async createUser(data) {
    const id = uuidv4();
    data.id = id;

    const { role } = data;

    delete data.role;

    const { columns, values, params } = handleCreate(data);

    writeData("users", { columns, values, params });

    this.createRole({
      user_id: id,
      role: JSON.stringify(role),
    });

    return id;
  }

  async createRole(data) {
    const id = uuidv4();
    data.id = id;

    const { columns, values, params } = handleCreate(data);
    writeData("roles", { columns, values, params });
  }
}

class Read {
  async readAll(table, fields, filters, joinTables, joinConditions) {
    const data = await readData(table, {
      fields,
      filters,
      joinTables,
      joinConditions,
    });
    return data;
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
    console.log(data);
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

export { Create, Read };