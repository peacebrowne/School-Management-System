import sqlite3 from "sqlite3";

let transaction;

// CONNECT TO DB
const db = new sqlite3.Database("database.db");

// CREATE USER TABLE
transaction = `CREATE TABLE IF NOT EXISTS users (
                fullname TEXT NOT NULL, email TEXT PRIMARY KEY NOT NULL, password TEXT NOT NULL, id TEXT NOT NULL
              );`;
// db.run(transaction);

// QUERY ALL THE DATA
const readData = async () => {
  transaction = "SELECT  id, fullname, color FROM users";
  return new Promise((resolve, reject) => {
    db.all(transaction, (err, data) => {
      if (err) return reject(err.message);
      resolve(data);
    });
  });
};

// INSERTING INTO DB
const writeData = async (data) => {
  const { fullname, email, password, id, color } = data;

  transaction =
    "INSERT INTO users(fullname, email, password, id) VALUES (?,?,?,?,?)";

  return new Promise((resolve, reject) => {
    db.run(transaction, [fullname, email, password, id, color], (error) => {
      if (error) return reject(error.message);
      resolve("User Successfully Registered!");
    });
  });
};

const singleUser = (id) => {
  transaction = `SELECT fullname, email, active, color FROM users WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.get(transaction, id, (err, data) => {
      if (err) return reject(err.message);
      resolve(data);
    });
  });
};

// SIGNIN VALIDATION
const getUserData = (email) => {
  transaction = `SELECT person.id, email, password, role, full_name FROM person, users, roles WHERE person.id = users.employee_id AND users.employee_id = roles.employee_id AND email = ? `;
  return new Promise((resolve, reject) => {
    db.get(transaction, email, (err, data) => {
      if (err) {
        return reject(err.message);
      }
      resolve(data);
    });
  });
};

export { readData, writeData, getUserData, singleUser };
