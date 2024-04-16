import sqlite3 from "sqlite3";

// CONNECT TO DB
const db = new sqlite3.Database("database.db");

class Transactions {
  constructor(table) {
    this.table = table;
  }

  write(columns, values) {
    return `INSERT INTO ${this.table} (${columns}) VALUES (${values})`;
  }

  read(fields = ["*"], filters = {}, tables = [], conditions = {}) {
    const columns = fields.join(", ");

    let query = `SELECT ${columns} FROM ${this.table}`;

    if (tables.length) {
      for (const [joinTable, condition] of Object.entries(conditions)) {
        query += ` JOIN ${joinTable} ON ${condition}`;
      }
    }

    const keys = Object.keys(filters);

    if (keys.length) {
      const filterClauses = keys.map((key) => `${key} = '${filters[key]}'`);
      const whereClause = ` WHERE ${filterClauses.join(" AND ")}`;
      query += whereClause;
    }

    return query;
  }

  update(fields, filters) {
    const columns = fields.map((field) => `${field} = ?`).join(", ");

    let query = `UPDATE ${this.table} SET ${columns} `;
    const keys = Object.keys(filters);

    if (keys.length) {
      const filterClauses = keys.map((key) => `${key} = '${filters[key]}'`);
      const whereClause = ` WHERE ${filterClauses.join(" AND ")}`;
      query += whereClause;
    }

    return query;
  }
}

class Interactions {
  writeData = async (table, data) => {
    return await new Promise((resolve, reject) => {
      const operations = new Transactions(table).write(
        data.columns,
        data.values
      );
      const params = data.params;

      db.run(operations, params, (error) => {
        if (error) return reject(error.message);
        resolve("User Successfully Registered!");
      });
    });
  };

  readData = async (table, data) => {
    return await new Promise((resolve, reject) => {
      const operations = new Transactions(table).read(
        data.fields,
        data.filters,
        data.joinTables,
        data.joinConditions
      );

      db.all(operations, (err, data) => {
        if (err) {
          return reject(err.message);
        }
        resolve(data);
      });
    });
  };

  updateData = async (table, data) => {
    return await new Promise((resolve, reject) => {
      const operations = new Transactions(table).update(
        data.fields,
        data.filters
      );

      const params = data.values;

      db.run(operations, params, (error) => {
        if (error) return reject(error.message);
        resolve("Update Successfully!");
      });
    });
  };

  deleteData = async (table, data) => {};
}

export default Interactions;
