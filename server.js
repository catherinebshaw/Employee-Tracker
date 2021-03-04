const inquirer = require('inquirer');
const { prompt } = require('inquirer');
const { inherits } = require('util');
const { employeeSearch } = require('./db/index');
const db = require('./db/index')
//initialize program
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
      message: 'What type of information would you like to see?',
      choices: [
        {   name: 'View all employees',
            value: "VIEW_EMPLOYEES",
        },
        {   name: 'View all departments',
            value: "VIEW_DEPARTMENTS",
        },
        {   name: 'View all Staff Roles',
            value: "VIEW_ROLES",
        },
        {   name: 'View all Staff By Manager',
            value: "VIEW_STAFF_BY_MGR",
        },
        {   name: 'Add an Employee',
            value: "ADD-EMPLOYEE",
        },
        {   name: 'Add a new role',
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
    ),
   // .then(response => console.log(response.action)) 

   // test the data that returns 
   
    // db.employeeSearch();  


//activate functions depending on response to prompts
    switch (action) {
        case "VIEW_EMPLOYEES":
            viewAllEmployee();
            break;

        case "VIEW_DEPARTMENTS":
            viewAllDeparments();    
            break;

        case "VIEW_ROLES":
            viewAllRoles()
            break;

        case "VIEW_STAFF_BY_MGR":
            viewAllMgr()
            break;

        case "ADD-EMPLOYEE":
            viewAllMgr()  
            break;

        default:
        quit()  
    }
    
};

//collect db search results to a variable and display in console
function viewAllEmployee()  {
    let results = employeeSearch();
    console.log(results);
    console.table(results);

    // call User Choice method 
    runSearch();
}

function viewAllDeparments()  {
    let results = departmentSearch();
    console.table(results);

    runSearch();
}

function viewAllRoles()  {
    let results = roleSearch();
    console.table(results);

    runSearch();
}

function viewAllMgr()  {
    let results = bymgrSearch();
    console.table(results);

    runSearch();
}

function viewAllDeparments()  {
    let results = departmentSearch();
    console.table(results);

    runSearch();
}

function quit()
