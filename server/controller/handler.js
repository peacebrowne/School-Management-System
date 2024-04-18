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
    this.createParentsStudents(id, relatives, "student");

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

  async createParents(data) {
    const id = uuidv4();

    const { relatives } = data;

    this.createParentsStudents(id, relatives);

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

    writeData("parents", { columns, values, params });
    return { id, msg: "Guardian Successfully Created!" };
  }

  async createParentsStudents(id, relatives, owner) {
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
        writeData("parents_students", { columns, values, params });
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

  async updateParent(data) {
    const { id } = data;

    const parent_info = await new Read().readValue(
      "parents",
      ["person_id", "occupation", "guardian_type"],
      {
        id: id,
      }
    );

    const person_filter = { id: parent_info.person_id };
    delete parent_info.person_id;

    const personal_info = await new Read().readValue(
      "person",
      undefined,
      person_filter
    );

    delete personal_info.id;

    for (const key in data) {
      if (Object.hasOwn(personal_info, key)) {
        personal_info[key] = data[key];
      }
    }

    // Updating personal information
    updateData("person", {
      ...handleUpdate(personal_info),
      ...{ filters: person_filter },
    });

    for (const key in data) {
      if (Object.hasOwn(parent_info, key)) {
        parent_info[key] = data[key];
      }
    }

    // Updating parent information
    const result = await updateData("parents", {
      ...handleUpdate(parent_info),
      ...{ filters: { id: id } },
    });

    return { msg: result };
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

const handleUpdate = (data) => {
  const columns = Object.keys(data)
    .map((field) => `${field} = ?`)
    .join(", ");

  const params = Object.values(data);

  return { columns, params };
};

export { Create, Read, Update };
