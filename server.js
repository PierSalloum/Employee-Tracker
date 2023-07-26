const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'shop_db',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
    startApp();
});

function startApp() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'option',
                message: 'Please select an option:',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Exit',
                ],
            },
        ])
        .then((answers) => {
            const { option } = answers;
            switch (option) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    console.log('Exiting the application.');
                    db.end();
                    break;
                default:
                    console.log('Invalid option.');
                    startApp();
                    break;
            }
        });
}

function viewDepartments() {
    db.query('SELECT * FROM departments', (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

function viewRoles() {
    db.query('SELECT * FROM roles', (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

function viewEmployees() {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of the department:',
            },
        ])
        .then((answers) => {
            const { name } = answers;
            db.query('INSERT INTO departments SET ?', { name }, (err) => {
                if (err) throw err;
                console.log('Department added successfully!');
                startApp();
            });
        });
}

function addRole() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the title of the role:',
        },
        {
          type: 'number',
          name: 'salary',
          message: 'Enter the salary for the role:',
        },
        {
          type: 'number',
          name: 'department_id',
          message: 'Enter the department ID for the role:',
        },
      ])
      .then((answers) => {
        const { title, salary, department_id } = answers;
        db.query(
          'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
          [title, salary, department_id],
          (err) => {
            if (err) throw err;
            console.log('Role added successfully!');
            startApp();
          }
        );
      });
  }
  
  function addEmployee() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'first_name',
          message: "Enter the employee's first name:",
        },
        {
          type: 'input',
          name: 'last_name',
          message: "Enter the employee's last name:",
        },
        {
          type: 'number',
          name: 'role_id',
          message: "Enter the employee's role ID:",
        },
        {
          type: 'number',
          name: 'manager_id',
          message: "Enter the employee's manager ID:",
        },
      ])
      .then((answers) => {
        const { first_name, last_name, role_id, manager_id } = answers;
        db.query(
          'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
          [first_name, last_name, role_id, manager_id],
          (err) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            startApp();
          }
        );
      });
  }
  
  function updateEmployeeRole() {
    db.query('SELECT * FROM employees', (err, results) => {
      if (err) throw err;
      console.table(results);
      inquirer
        .prompt([
          {
            type: 'number',
            name: 'employee_id',
            message: "Enter the employee's ID to update:",
          },
          {
            type: 'number',
            name: 'new_role_id',
            message: "Enter the new role ID for the employee:",
          },
        ])
        .then((answers) => {
          const { employee_id, new_role_id } = answers;
          db.query(
            'UPDATE employees SET role_id = ? WHERE id = ?',
            [new_role_id, employee_id],
            (err) => {
              if (err) throw err;
              console.log('Employee role updated successfully!');
              startApp();
            }
          );
        });
    });
  }
  