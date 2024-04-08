CREATE TABLE person(
  id TEXT PRIMARY KEY,
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  contact_number TEXT,
  place_of_birth TEXT,
  gender TEXT,
	city TEXT,
  address TEXT,
  nationality TEXT,
"full_name" TEXT NULL
);

CREATE TABLE teachers (
    id TEXT PRIMARY KEY,
    employee_id INTEGER,
    FOREIGN KEY (employee_id) REFERENCES employees (id)
  );

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    username TEXT,
    employee_id INTEGER,
    FOREIGN KEY (employee_id) REFERENCES employees (id)
  );

CREATE TABLE students (
    id TEXT PRIMARY KEY,
    person_id INTEGER NOT NULL,
    FOREIGN KEY (person_id) REFERENCES person (id)
  );

CREATE TABLE employees (
    id TEXT PRIMARY KEY,
    person_id INTEGER,
    departments TEXT,
    position TEXT,
    salary REAL,
    employee_type TEXT NULL,
    FOREIGN KEY (person_id) REFERENCES person (id)
  );
  
CREATE TABLE roles (
    id TEXT PRIMARY KEY,
    employee_id INTEGER,
    role TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees (id)
  );
