-- Drops the employees_db if it exists currently --
DROP DATABASE IF EXISTS company_db;
-- Creates the "employees_db" database --
CREATE DATABASE company_db

-- Makes it so all of the following code will affect animals_db --
USE company_db;

-- Creates the first table "department" within company_db --
CREATE TABLE department (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows Sets id as this table's primary key--
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  -- Makes a string column called "name" which cannot contain null --
  name VARCHAR(30) UNIQUE NOT NULL,
);

-- Creates the second table "role" within company_db --
CREATE TABLE role (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  -- Makes a string column called "title" which cannot contain null --
  title VARCHAR(30) UNIQUE NOT NULL,
  -- Makes a decimal column called "salary" which cannot contain null --
  salary DECIMAL UNSIGNED NOT NULL,
  -- Makes an Integer column called "department_id" --
  department_id INT UNSIGNED NOT NULL,
  INDEX dep_ind (department_id)
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);


-- Creates the table "employee" within company_db --
CREATE TABLE employee (
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  -- Makes a string column called "first name" which cannot contain null --
  first_name VARCHAR(30) NOT NULL,
  -- Makes a string column called "last name" which cannot contain null --
  last_name VARCHAR(30) NOT NULL,
  -- Makes an Integer column called "role_id" --
  role_id INT UNSIGNED NOT NULL,
  --
  INDEX role_id (role_id),

  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
  -- Makes an Integer column called "manager_id" --
  manager_id INT UNSIGNED,

  INDEX man_ind (manager_id)

  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);






