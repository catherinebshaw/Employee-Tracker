const connection = require('./connection')

class DB {
  constructor(connection){
    this.connection = connection
  }
  
  employeeSearch(){
    return this.connection.query(
    "SELECT employee.id, CONCAT( employee.first_name, ' ', employee.last_name) AS Employee, role.title, department.name AS Department, role.salary as Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager on employee.manager_id = manager.id;"
    );
  }

  departmentSearch(){
    return this.connection.query(
      "SELECT name as Department, COUNT(employee.role_id) as Employees, sum(role.salary) as Budget FROM employee LEFT join role on employee.role_id=role.id LEFT join department ON role.department_id = department.id GROUP BY department.id, department.name;"
    )
  }
  
  delDept(department){
    return this.connection.query( "DELETE FROM department WHERE name = ?", department)
  }
  
  editDept(department){ 
    return this.connection.query("UPDATE department SET name= '?' WHERE department.id=?", department)

  }

  addDept(department){
    return this.connection.query( "INSERT INTO department (name) VALUE (?)", department)
  }
  roleSearch(role) {
    return this.connection.query(
      "SELECT DISTINCT role.id, role.title as Title, role.salary AS Salary FROM employee LEFT join role on employee.role_id = role.id ORDER BY Salary;", role
    )
  };

  
  mgrSearch(){
    return this.connection.query(
      "SELECT DISTINCT manager.id AS id, manager.first_name, manager.last_name FROM employee employee LEFT JOIN employee manager on employee.manager_id = manager.id WHERE manager.first_name IS NOT NULL;")
  }

 RoleID(title){
    return this.connection.query( `SELECT id FROM role WHERE title = “${title}";`)
  }

//  locateRoleID(role){
//   const results = await db.query(sql)
//   console.log(`the number result is`, results)
//   console.log(`the number ID is `, results[0].id)
//   return results[0].id
  
//   return this.connection.query() `SELECT id FROM department WHERE name = “${depName}“`);
      
//     }

  addEmployee(employee){
    return this.connection.query( "INSERT INTO employee SET ?" , employee)

  }
  
  addRole(role){
    return this.connection.query( "INSERT INTO role SET ?", role)
  }

  

  getEmployees(roles){
    return this.connection.query( "SELECT CONCAT(employee.first_name,' ', employee.last_name) as name, role.title FROM employee LEFT JOIN role ON role_id = role.id;", roles)
  }

  editRole(employee){
    return this.connection.query( "UPDATE employee SET role_id=? WHERE employee.id=?", employee)
  }

  getEmpName(employee){
    return this.connection.query( "SELECT Employee.id, CONCAT( employee.first_name, ' ', employee.last_name) AS Employee FROM employee", employee)
  }

  delEmployee(id){
    return this.connection.query( "DELETE FROM employee WHERE employee.id=?", id)
  }

}


module.exports = new DB(connection);
