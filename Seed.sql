USE company_db

-- Creates new rows containing data in all named columns --
INSERT INTO department (name) VALUES (Sales);
INSERT INTO department (name) VALUES (Engineering);
INSERT INTO department (name) VALUES (Finance);
INSERT INTO department (name) VALUES (Legal);
--Seed table with role information
INSERT INTO role (title, salary, department_id ) VALUES ("Sales Rep",  80000, 1);

INSERT INTO role (title, salary, department_id ) VALUES ("Sales Lead",  100000, 1);

INSERT INTO role (title, salary, department_id ) VALUES ("Software Engineer",  120000, 2);

INSERT INTO role (title, salary, department_id ) VALUES ("Lead Engineer",  150000, 2);

INSERT INTO role (title, salary, department_id ) VALUES ("Accountant",  125000, 3);

INSERT INTO role (title, salary, department_id ) VALUES ("Legal Team Lead",  250000, 4);

INSERT INTO role (title, salary, department_id ) VALUES ("Lawyer",  190000, 4);
--Seed table with employee information
INSERT INTO employee ((first_name, last_name, role_id) VALUES ("Sarah", "Lourd", 7 );

INSERT INTO employee (first_name, last_name, role_id) VALUES ("Ashley", "Rodriquez", 5 );

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jane", "Doe", 3, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kevin", "Smith", 4, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Mike", "Chan", 1, 4);

INSERT INTO employee (first_name, last_name, role_id) VALUES ("Malia", "Brown",  6 );

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Tom", "Allen", 8, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Hitesh", "Seth", 4, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jim", "Kimmel", 5, 2;

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kim", "Yen", 1, 4);