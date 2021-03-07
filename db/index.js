const connection = require('./connection')

class DB {
  constructor(connection){
    this.connection = connection
  }
  
  employeeSearch(){
    return this.connection.query(
    "SELECT employee.id, CONCAT( employee.first_name, ' ', employee.last_name) AS Employee, role.title, department.name AS Department, role.salary as Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager on employee.manager_id = manager.id;"
    );
   // console.table(data [,columns]),
 
  }

  departmentSearch(){
    return this.connection.query(
      "SELECT name as Department, COUNT(employee.role_id) as Employees, sum(role.salary) as Budget FROM employee LEFT join role on employee.role_id=role.id LEFT join department ON role.department_id = department.id GROUP BY department.id, department.name;"
    )
  };

  roleSearch(role) {
    return this.connection.query(
      "SELECT DISTINCT role.title, role.salary FROM employee LEFT join role on employee.role_id = role.id ORDER BY salary;", role
    )
  };

  bymgrSearch(){
    return this.connection.query(
      "SELECT DISTINCT concat(manager.first_name, '  ', manager.last_name) AS Manager FROM employee employee LEFT JOIN employee manager on employee.manager_id = manager.id WHERE manager.last_name IS NOT NULL ORDER by manager ASC;")
  }

  addEmployee(employee){
    return this.connection.query( "INSERT INTO employee SET ?", employee)

  }
  
  addRole(role){
    return this.connection.query( "INSERT INTO role SET ?", role)
  }

  addDept(department){
    return this.connection.query( "INSERT INTO role SET ?", role)
  }

}

module.exports = new DB(connection);
//employeeSearch()
