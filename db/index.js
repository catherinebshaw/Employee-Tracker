const connection = require('./connection')


console.log(db);

class DB {
  constructor(connection){
    this.connection = connection
  }


  employeeSearch(){
    return this.connection.query(
    "SELECT employee.id, concat( employee.first_name, '   ', employee.last_name) AS Employee, role.title, department.name AS Department, role.salary as Salary, concat(manager.first_name, '  ', manager.last_name) AS Manager FROM employee employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager on employee.manager_id = manager.id;SELECT employee.id, concat( employee.first_name, '   ', employee.last_name) AS Employee, role.title, department.name AS Department, role.salary as Salary, concat(manager.first_name, '  ', manager.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id JOIN employee manaager on employee.manager_id = manager.id;"
    );
   // console.table(data [,columns]),
 
  }


  departmentSearch(){
    return this.connection.query(
      "SELECT name as Department, COUNT(employee.role_id) as Employees, sum(role.salary) as Budget FROM employee LEFT join role on employee.role_id=role.id LEFT join department ON role.department_id = department.id GROUP BY department.id, department.name;"
    )
  };

  roleSearch() {
    return this.connection.query(
      "SELECT concat(employee.first_name, ' ', employee.last_name) as Employee, role.title, role.salary FROM employee LEFT join role on employee.role_id = role.id ORDER BY salary; "
    )
  };
  bymgrSearch(){
    return this.connection.query(
      "SELECT concat(manager.first_name, '  ', manager.last_name) AS Manager, concat(employee.first_name, ' ', employee.last_name) as Employee FROM employee employee LEFT JOIN employee manager on employee.manager_id = manager.id ORDER by manager DESC;"
    )
  }
}

module.exports = new DB(connection);
//employeeSearch()
