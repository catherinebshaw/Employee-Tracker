const inquirer = require('inquirer');
const Choices = require('inquirer/lib/objects/choice')
// const { prompt } = require('inquirer');
// const { Server } = require('node:http');
const { inherits } = require('util');
const { delDept } = require('./db/index');
// const { employeeSearch, roleSearch } = require('./db/index');
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
        {   name: 'Review a list of all our employees',
            value: "VIEW_EMPLOYEES",
        },
        {   name: 'Review a list of all departments and associated budgets',
            value: "VIEW_DEPARTMENTS",
        },
        {   name: 'Review a list of roles within the company',
            value: "VIEW_ROLES",
        },
        {   name: 'View all managers',
            value: "VIEW_STAFF_BY_MGR",
        },
        {   name: 'Add a new employee',
            value: "ADD-EMPLOYEE",
        },
        {   name: 'Add a new role to the Company',
            value: "ADD_ROLE",
        },
        {   name: 'Change the role of an employee in the organization',
            value: "EDIT_ROLE",
        },
        {   name: 'Change or add a department',
            value: "CHANGE_DEPARTMENT",
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

        case "ADD-EMPLOYEE":
            addNewEmployee()  
            break;
          
        case "ADD_ROLE":
            addRole()  
            break;

        case "EDIT_ROLE":
            updateRole()  
            break;

        case "CHANGE_DEPARTMENT":
            changeDept()  
            break;

        case "DELETE_EMPLOYEE":
            deleteEmployee()
            break;

        default:
        quit()  
    }
    
};

//collect db search results to a variable and display in console
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
    let results = await db.mgrSearch();
    console.table(results);
    runSearch();
}

async function addNewEmployee() {
    let roles = await db.roleSearch()
    console.log(roles)
    let manager = await db.mgrSearch()
    console.log(manager)

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
                    roles.forEach(({id, Title}) => {
                        fullRoleList.push(id + ' ' + Title);
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

    var employee = {
        first_name: newEmp.first_name,
        last_name: newEmp.last_name,
        role_id: role,
        manager_id: empMid,
    }
    console.log('adding New Employee:', employee)
    db.addEmployee(employee)

    runSearch()

}

async function addRole(){
    let roles = await db.roleSearch()
    let department = await db.getDept()
    console.log(department)

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

    var result = newRole.department.split(' ')
    var dept = result[0]

    var newRole = {
        title : newRole.title,
        salary : newRole.salary,
        department_id : dept,
    }
    
    const roleName = []
    roles.forEach(({Title}) => {
        roleName.push(Title);
    });
    if (newRole.title === roleName.Title){
        console.log('that name is not recognized or already exists, please select another')
        addRole()
    } else {
    db.addRole(newRole);
    console.log("new role added:",  newRole)
    console.table(newRole)
    }
    runSearch()       

}

async function changeDept(){
    let department = await db.getDept()
    console.log(department)
    const response = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Would you like to edit or delete a department?',
                choices: [{ value: 'edit', name: 'Edit Department'}, 
                        {value: 'del', name: 'Delete Department'}]
            },
            {
                type: 'list',
                name: 'name',
                message: 'Choose the department:',
                choices(){
                    const deptList = []
                    department.forEach(({id, name}) => {
                        deptList.push(id + ' ' + name);
                    });
                    return deptList; 
                }
            },
    ])

    console.log("chosen action:", response)
    var result = response.name.split(' ')
    var deptName = result[1]
    if( response.action === 'del'){
        db.delDept(deptName)
        }
        else if ( response.action === 'edit'){
            editDept(deptName)
    }

    async function editDept(deptName){
        const response = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What would you like the new department name to be?'
            }
            ])
        
            var updatedDept = {
            id: deptName[0],
            name: response.name,
        }
        db.editDept(updatedDept)
        console.log( `updating department name to ${response.name}`)
    }
    
    runSearch()       

}

async function updateRole(){

    var employees = await db.getEmpName();
    console.table(employees)
    var roles = await db.roleSearch();
    console.table(roles)
    var mgr = await db.mgrSearch();
    console.table(mgr)

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
                    roles.forEach(({id, Title}) => {
                        rolesList.push(id + ' ' + Title);
                    });
                    return rolesList; 
                }
            },
            // {
            //     type: 'list',
            //     name: 'manager',
            //     message: 'Who will manage this employee?',
            //     choices(){
            //         const mgrList = []
            //         mgr.forEach(({id, first_name, last_name}) => {
            //             mgrList.push(id + ' ' + first_name + ' ' + last_name);
            //         });
            //         return mgrList; 
            //     }
            // },
        ])
        console.log('updating employee:', update)

        var answer = update.name.split(' ')
        var employeeID = parseInt(answer[0])
        var job = update.role.split(' ')
        var role_id = parseInt(job[0])
        // var newMgr = update.manager.split(' ')
        // var empMgrID = parseInt(newMgr[0])

        var updateRole = 
            {   id: employeeID,
                role_id: role_id}
            // manager_id: empMgrID }

        db.editRole(updateRole);
        console.table(updateRole)
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
    var delEmpl = { 
        id: employeeID }

    delEmployee(delEmpl);
    console.log(`Employee ${delEmpl} has been removed`)
    runSearch()       

}



function quit(){
    process.exit()
}
