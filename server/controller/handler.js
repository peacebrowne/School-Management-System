import { v4 as uuidv4 } from "uuid";
import Interactions from "../repositories/repositories.js";

const { writeData, readData, updateData, deleteData } = new Interactions();

class Create {
  async createEmployee(data) {
    const id = uuidv4();

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
      email: data?.email ?? "",
    });

    const { columns, values, params } = handleCreate({
      id: id,
      department: data?.department ?? "",
      salary: data?.salary ?? "",
      employee_type: data?.employee_type ?? "",
      person_id: person_id,
    });

    const result = await writeData("employees", { columns, values, params });

    return { msg: `Employee ${result} Created!`, id };
  }

  async createTeacher(data) {
    const id = uuidv4();

    const employee = await this.createEmployee(data);

    const { columns, values, params } = handleCreate({
      id: id,
      employee_id: employee.id,
    });

    const result = await writeData("teachers", { columns, values, params });
    return { msg: `Teacher ${result} Created!`, id };
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

    const { relatives, class_name, max_strength } = data;
    this.createParentsStudents(id, relatives, "student");

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
      class_id: class_name,
    });

    writeData("students", { columns, values, params });
    new Update().updateClasses({ class_name, max_strength });

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
      email: data?.email ?? "",
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

    const { roles } = data;

    delete data.roles;

    const { columns, values, params } = handleCreate(data);

    this.createRole({
      user_id: id,
      roles: JSON.stringify(roles),
    });

    const result = await writeData("users", { columns, values, params });

    return { msg: `User ${result} Created!`, id };
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

    return data[0] ? data[0] : false;
  }
}

class Update {
  async updateStudent(data) {
    const { id } = data;

    const student_info = await new Read().readValue(
      "students",
      ["person_id", "class_id"],
      { id: id }
    );

    const student_filter = { id: student_info.person_id };
    delete student_info.id;

    const personal_info = await new Read().readValue(
      "person",
      undefined,
      student_filter
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
      ...{ filters: student_filter },
    });

    for (const key in data) {
      if (Object.hasOwn(student_info, key)) {
        student_info[key] = data[key];
      }
    }

    // Updating employee's information
    const result = await updateData("students", {
      ...handleUpdate(student_info),
      ...{ filters: { id: id } },
    });

    return { msg: result, id: id };
  }

  async updateEmployee(data) {
    const { id } = data;

    const employee_info = await new Read().readValue(
      "employees",
      [
        "person_id",
        "department",
        "position",
        "salary",
        "employee_type",
        "salutation",
      ],
      { id: id }
    );

    const employee_filter = { id: employee_info.person_id };
    delete employee_info.id;

    const personal_info = await new Read().readValue(
      "person",
      undefined,
      employee_filter
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
      ...{ filters: employee_filter },
    });

    for (const key in data) {
      if (Object.hasOwn(employee_info, key)) {
        employee_info[key] = data[key];
      }
    }

    // Updating employee's information
    const result = await updateData("employees", {
      ...handleUpdate(employee_info),
      ...{ filters: { id: id } },
    });

    return { msg: result, id: id };
  }

  async updateParent(data) {
    const { id } = data;

    const parent_info = await new Read().readValue(
      "parents",
      ["person_id", "occupation", "guardian_type"],
      { id: id }
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

  async updateClasses(data) {
    let { class_name, max_strength } = data;

    updateData("classes", {
      ...handleUpdate({ max_strength: --max_strength }),
      ...{ filters: { id: class_name } },
    });
  }
}

class Delete {
  async deleteUser(data) {
    await deleteData("roles", handleDelete({ user_id: data.id }));
    const result = await deleteData("users", handleDelete(data));
    return { msg: `User ${result} Deleted!` };
  }

  async deleteEmployee(data) {
    const result = await deleteData("employees", handleDelete(data));
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

const handleDelete = (data) => {
  const values = Object.keys(data).map((field) => `${field} = ?`);
  const params = Object.values(data);
  return { values, params };
};

export { Create, Read, Update, Delete };
