const connection = require('./connection')

class DB {
  constructor(connection){
    this.connection = connection
  }
  roleSearch(role) {
    return this.connection.query("SELECT role.id, role.title, role.salary, department.name as Department FROM role LEFT JOIN department ON department_id = department.id ORDER BY department_id;", role)
  };

  mgrSearch(manager){
    return this.connection.query(
      "SELECT DISTINCT manager.id AS id, manager.first_name, manager.last_name FROM employee employee LEFT JOIN employee manager on employee.manager_id = manager.id WHERE manager.first_name IS NOT NULL;", manager)
  }
  
  addEmployee(employee){
    return this.connection.query( "INSERT INTO employee SET ?" , employee)

  }
  
  getDept(){
    return this.connection.query("SELECT * FROM department;")
  }

  addRole(role){
    return this.connection.query( "INSERT INTO role SET ?", role)
  }

  addDept(department){
    return this.connection.query( "INSERT INTO department (name) VALUE (?)", department)
  }

  employeeSearch(){
    return this.connection.query(
    "SELECT employee.id, CONCAT( employee.first_name, ' ', employee.last_name) AS Employee, role.title, department.name AS Department, role.salary as Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager on employee.manager_id = manager.id;"
    );
  }

  departmentSearch(){
    return this.connection.query(
      "SELECT department.name as Department, count(role.id) as Employees, sum(role.salary) as Budget FROM department LEFT JOIN role on role.department_id=department.id LEFT join employee ON role.id = employee.role_id GROUP BY department.id, department.name;")
  }
  
  employeebyMgr(manager){
    return this.connection.query(
    "SELECT employee.first_name, employee.last_name, role.title as Role FROM employee employee LEFT JOIN employee manager on employee.manager_id = manager.id LEFT JOIN role on employee.role_id = role.id WHERE manager.id = ?;", manager)
  }

  delDept(department){
    return this.connection.query( "DELETE FROM department WHERE name = ?", department)
  }

  RoleID(title){
    return this.connection.query( `SELECT id FROM role WHERE title = “${title}";`)
  }

  getEmployees(roles){
    return this.connection.query( "SELECT CONCAT(employee.first_name,' ', employee.last_name) as name, role.title FROM employee LEFT JOIN role ON role_id = role.id;", roles)
  }

  editRole(roleID,employeeID){
    return this.connection.query( `UPDATE employee SET role_id = ${roleID} WHERE employee.id = ${employeeID};` )
  }

  getEmpName(employee){
    return this.connection.query( "SELECT Employee.id, employee.first_name, employee.last_name FROM employee", employee)
  }

  delEmployee(id){
    return this.connection.query( "DELETE FROM employee WHERE employee.id=?", id)
  }

}


module.exports = new DB(connection);
