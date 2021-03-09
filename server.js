const inquirer = require('inquirer');
const Choices = require('inquirer/lib/objects/choice')
const { inherits } = require('util');
const { delDept, addDept } = require('./db/index');
const db = require('./db/index')
//initialize program
var employee 
var empRole_id;
var empMid;

var department

init();

function init(){
    runSearch()
}
//initialize prompt questions
async function runSearch(){
    const {action} = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'What would you like to do today?',
      choices: [
        {   name: 'Add a new employee',
            value: "ADD-EMPLOYEE",
        },
        {   name: 'Add a new role to the Company',
            value: "ADD_ROLE",
        },
        {   name: 'Add a new department to the Company',
            value: "ADD_DEPARTMENT",
        },   
        {   name: 'Review a list of all the departments and associated budgets',
            value: "VIEW_DEPARTMENTS",
        },
        {   name: 'Review a list of roles within the company',
            value: "VIEW_ROLES",
        },
        {   name: 'Review a list of all the employees',
            value: "VIEW_EMPLOYEES",
        },
        {   name: 'View the employees working for a specific manager',
            value: "VIEW_STAFF_BY_MGR",
        },
        {   name: 'Change the role of an employee in the organization',
            value: "EDIT_ROLE",
        },
        {   name: 'Delete a department',
            value: "DELETE_DEPARTMENT",
        },
        {   name: 'Remove an employee from the organization',
            value: "DELETE_EMPLOYEE",    
        },
        {   name: 'Quit',
            value: "QUIT",
        },
        ],  
    },
    ]
    )

//activate functions depending on response to prompts
    switch (action) {
        case "ADD-EMPLOYEE":
            addNewEmployee()  
            break;
            
        case "ADD_ROLE":
            addRole()  
            break;

        case "ADD_DEPARTMENT":
            addDepartment()
            break;

        case "VIEW_EMPLOYEES":
            viewAllEmployee();
            break;

        case "VIEW_DEPARTMENTS":
            viewAllDeparments();    
            break;

        case "VIEW_ROLES":
            viewRoles()
            break;

        case "VIEW_STAFF_BY_MGR":
            viewAllMgr()
            break;

        case "EDIT_ROLE":
            updateRole()  
            break;

        case "DELETE_DEPARTMENT":
            deleteDept()  
            break;

        case "DELETE_EMPLOYEE":
            deleteEmployee()
            break;

        default:
        quit()  
    }
    
};

//add an employee
async function addNewEmployee() {
    //get roles and managers from db for inquirer choices
    let roles = await db.roleSearch()
    let manager = await db.getEmpName()

    var newEmp = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is the first name of the new Employee?',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is last name of the New Employee?',
            },
            {
                type: 'list',
                name: 'title',
                message: 'What will the role of the new Employee be?',
                choices(){
                    const fullRoleList = []
                    roles.forEach(({id, title}) => {
                        fullRoleList.push(id + ' ' + title);
                    });
                    return fullRoleList;
                },
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who will be the Manager of the new employee?',
                choices(){
                    const managerList = []
                    manager.forEach(({id, first_name, last_name}) => {
                        managerList.push(id + ' ' + first_name + ' ' + last_name);
                    });
                    return managerList;
                },
            },
        ]);
    var result = newEmp.title.split(' ')
    var role = result[0]
    var mgr = newEmp.manager.split(' ')
    var empMid = mgr[0] 
    //new object to be added to database
    var employee = {
        first_name: newEmp.first_name,
        last_name: newEmp.last_name,
        role_id: role,
        manager_id: empMid,
    }
    console.log('adding New Employee:', employee)
    //command to the database on index.js
    db.addEmployee(employee)

    runSearch()

}
//add a new role
async function addRole(){
    //pull roles and departments from database for inquirer choices
    let roles = await db.roleSearch()
    let department = await db.getDept()
    console.log("The current roles in the company are:")
    console.table(roles)

    var newRole = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What role would you like to add?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What salary would be associated with this role?',
            },
            {
                type: 'list',
                name: 'department',
                message: 'What department would that role be a part of?',
                choices(){
                    const deptList = []
                    department.forEach(({id, name}) => {
                        deptList.push(id + ' ' + name);
                    });
                    return deptList;    
                }

            },
    ])
    //split out inquirer choice to isolate department id
    var result = newRole.department.split(' ')
    var dept = result[0]
    //new role object to be added to the database
    var newRole = {
        title : newRole.title,
        salary : newRole.salary,
        department_id : dept,
    }
    //make sure it doesn't already exist or error will occur
    const roleName = []
    roles.forEach(({Title}) => {
        roleName.push(Title);
    });
    try {
        if (newRole.title === roleName.Title) throw "That role already exists";
    } catch(err) {
        addRole()
    }
        
    //add new role to the database
    db.addRole(newRole);
    console.log("new role added:",  newRole)
    console.table(newRole)
    
    runSearch()       

}
//add a new department
async function addDepartment(){
    let department = await db.getDept()
    console.log("The current departments in the company are:")
    console.table(department)

    var response = await inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What department would you like to add?',
        },
    ]);

    
    console.log("adding new department:", response.department)
    db.addDept(response.department)
    
    runSearch()
}

async function viewAllEmployee()  {
    let results = await db.employeeSearch();
    console.table(results)
    runSearch();
}

async function viewAllDeparments()  {
    let results = await db.departmentSearch();
    console.table(results);   
    runSearch();
}

async function viewRoles()  {
    let results = await db.roleSearch();
    console.table(results);
    runSearch();
}

async function viewAllMgr()  {
    let managers = await db.mgrSearch(); 
    const response = await inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'Choose the manager:',
            choices(){
                const mgrList = []
                managers.forEach(({id, first_name, last_name}) => {
                   mgrList.push(id + ' ' + first_name + ' ' + last_name);
                });
                return mgrList; 
            }
        },
])
        console.log("Employees for manager:", response)
        var result = response.name.split(' ')
        var mgrAll = result[0]

        let empbymgr = await db.employeebyMgr(mgrAll)

    console.table(empbymgr);
    runSearch();
}


async function deleteDept(){
    let department = await db.getDept()
    console.log('These are the current departments:')
    console.table(department)
    const response = await inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Choose the department you would like to delete:',
                choices(){
                    const deptList = []
                    department.forEach(({id, name}) => {
                        deptList.push(id + ' ' + name);
                    });
                    return deptList; 
                }
            },
    ])

    var result = response.name.split(' ')
    var deptName = result[1]
    
    db.delDept(deptName)
    console.log( 'Deleting the following department:', deptName)
    
    runSearch()
   
}

async function updateRole(){

    var employees = await db.getEmpName();
    console.table(employees)
    var roles = await db.roleSearch();
    console.table(roles)
    
        var update = await inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Choose the employee:',
                choices(){
                    const empList = []
                    employees.forEach(({id, first_name, last_name}) => {
                        empList.push(id + ' ' + first_name + ' ' + last_name);
                    });
                    return empList; 
                }
            },
            {
                type: 'list',
                name: 'role',
                message: 'What new role would you like to assign to this employee?',
                choices(){
                    const rolesList = []
                    roles.forEach(({id, title}) => {
                        rolesList.push(id + ' ' + title);
                    });
                    return rolesList; 
                }
            },
        ])

        var answer = update.name.split(' ')
        var employeeID = parseInt(answer[0])
        var job = update.role.split(' ')
        var roleID = parseInt(job[0])

        // var updateRole = 
        //     {   role_id: roleID,
        //         id: employeeID
        //         }
            
        console.log(employeeID, roleID)
        let results = await db.editRole(roleID,employeeID);
        
        console.table(results)
        runSearch()       

}

async function deleteEmployee(){
    var employees = await db.getEmpName();
    console.table(employees)
    
    var result = await inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'Choose the employee you would like to remove',
            choices(){
                const empList = []
                employees.forEach(({id, first_name, last_name}) => {
                    empList.push(id + ' ' + first_name + ' ' + last_name);
                });
                return empList; 
            }
        },
    ])
    var empID = result.name.split(' ')
    var employeeID = parseInt(empID[0])

    db.delEmployee(employeeID);
    console.log('An employee with this ID has been removed:', employeeID)
    runSearch()       

}



function quit(){
    process.exit()
}
