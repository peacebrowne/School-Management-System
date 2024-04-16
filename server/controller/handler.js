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

  async createPerson(data) {
    const id = uuidv4();
    data.id = id;

    const { columns, values, params } = handleCreate(data);

    writeData("person", { columns, values, params });

    return id;
  }

  async createStudent(data) {
    const id = uuidv4();

    const { relatives, class_name } = data;
    this.createGuardiansStudents(id, relatives, "student");

    const class_id = await new Read().readValue("classes", ["id"], {
      name: class_name,
    });

    const person_id = await this.createPerson({
      first_name: data.first_name,
      middle_name: data?.middle_name ?? "",
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      contact_number: data?.contact_number ?? "",
      gender: data.gender,
      city: data?.city,
      address: data?.address ?? "",
      nationality: data?.nationality ?? "",
      email: data?.middle_name ?? "",
    });

    const { columns, values, params } = handleCreate({
      id: id,
      person_id: person_id,
      class_id: class_id.id,
    });

    writeData("students", { columns, values, params });
    return { id, msg: "Student Successfully Created!" };
  }

  async createGuardians(data) {
    const id = uuidv4();

    const { relatives } = data;

    this.createGuardiansStudents(id, relatives);

    const person_id = await this.createPerson({
      first_name: data.first_name,
      middle_name: data?.middle_name ?? "",
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      contact_number: data?.contact_number ?? "",
      gender: data.gender,
      city: data?.city,
      address: data?.address ?? "",
      nationality: data?.nationality ?? "",
      email: data?.middle_name ?? "",
    });

    const { columns, values, params } = handleCreate({
      id: id,
      person_id: person_id,
      occupation: data?.occupation ?? "",
      guardian_type: data.guardian_type,
    });

    writeData("guardians", { columns, values, params });
    return { id, msg: "Guardian Successfully Created!" };
  }

  async createGuardiansStudents(id, relatives, owner) {
    if (relatives.length) {
      for (const relative of relatives) {
        if (owner === "student") {
          relative.student_id = id;
          relative.guardian_id = relative.id;
        } else {
          relative.guardian_id = id;
          relative.student_id = relative.id;
        }

        delete relative.id;

        const { columns, values, params } = handleCreate(relative);
        writeData("guardians_students", { columns, values, params });
      }
    }
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

  async readValue(table, fields, filters) {
    const data = await readData(table, {
      fields,
      filters,
    });

    return data[0] ? data[0] : data;
  }
}

class Update {
  updateEmployee(fields, values, filters) {
    updateData("employees", { fields, values, filters });
  }

  async updateStudent(fields, values, filters) {
    const person = await new Read().readValue(
      "students",
      ["person_id"],
      filters
    );

    const person_filter = { id: person.person_id };
    updateData("person", { fields, values, filters: person_filter });
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

export { Create, Read, Update };
