const inquirer = require('inquirer');
const { prompt } = require('inquirer');
const { inherits } = require('util');
const Employee = require('../Team-Builder/Develop/lib/Employee');
const { employeeSearch } = require('./db/index');
const db = require('./db/index')
//initialize program
var employee 
var role
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
        {   name: 'Add a role',
            value: "ADD_ROLE",
        },
        {   name: 'Add a new department',
            value: "ADD_DEPARTMENT",
        },
        {   name: 'Update an employee role',
            value: "EDIT_ROLE",
        },
        {   name: 'Update an employee manager',
            value: "EDIT_Manager",
        },
        {   name: 'Delete an employee',
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

        case "ADD_DEPARTMENT":
            addDept()  
        break;

        case "EDIT_ROLE":
            updateRole()  
        break;

        case "EDIT_Manager":
            updateRole()  
        break;

        case "DELETE_EMPLOYEE":
            updateRole()  
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
    let results = await db.bymgrSearch();
    console.log(results)
    console.table(results);

    runSearch();
}

async function addNewEmployee() {
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
                name: 'role',
                message: 'What will the role of the new Employee be?',
                choices:['Sales Rep', 'Sales Lead', 'Software Engineer', 'Accountant', 'Lawyer']
            },
    ])
    let role_num;
    if (newEmp.role === 'Sales Rep'){ role_num = 1} 
    else if (newEmp.role === 'Sales Lead'){role_num = 2}
    else if (newEmp.role === 'Software Engineer'){role_num = 3}
    else if (newEmp.role === 'Accountant'){role_num = 6}
    else if (newEmp.role === 'Lawyer'){role_num = 8}

    let mgr;
    if (newEmp.role === 'Sales Rep'){ mgr = 4} 
    else if (newEmp.role === 'Sales Lead'){mgr = 2}
    else if (newEmp.role === 'Software Engineer'){mgr = 2}
    else if (newEmp.role === 'Accountant'){mgr = 10}
    else if (newEmp.role === 'Lawyer'){mgr = 1}

    var newEmployee = {
        first_name : newEmp.first_name,
        last_name : newEmp.last_name,
        role_id : role_num,
        manager_id : mgr
    }

    let result = await db.addEmployee(newEmployee);
    console.table(newEmployee)
    runSearch()
    // var createEmp = await db.addEmployee(newEmployee);
    // console.log(createEmp);

}

async function addRole(){
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
                choices:['Sales', 'Finance', 'Engineering', 'Legal']

            },
    ])

    let dept_num;
    if (newRole.department === 'Sales'){ dept_num = 1} 
    else if (newRole.department === 'Engineering'){dept_num = 2}
    else if (newRole.department === 'Finance'){dept_num = 3}
    else if (newRole.department === 'Legal'){dept_num = 4}

    var newRole = {
        title : newRole.title,
        salary : newRole.salary,
        department_id : dept_num,
    }
    let result = await db.addRole(newRole);
    console.table(newRole)
    runSearch()       

}

async function addDept(){
    var newDept = await inquirer.prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What department would you like to add?',
            },
    ])

    var newDept = { name : newDept.name }
    let result = await db.addRole(newDept);
    console.table(newDept)
    runSearch()       

}







function quit(){
    process.exit()
}
