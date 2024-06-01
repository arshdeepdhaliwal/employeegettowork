const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db');

const start = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Update an employee manager',
      'View employees by manager',
      'View employees by department',
      'Remove a department',
      'Remove a role',
      'Remove an employee',
      'View department budgets',
      'Exit'
    ]
  }).then(answer => {
    switch (answer.action) {
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
      case 'Update an employee manager':
        updateEmployeeManager();
        break;
      case 'View employees by manager':
        viewEmployeesByManager();
        break;
      case 'View employees by department':
        viewEmployeesByDepartment();
        break;
      case 'Remove a department':
        removeDepartment();
        break;
      case 'Remove a role':
        removeRole();
        break;
      case 'Remove an employee':
        removeEmployee();
        break;
      case 'View department budgets':
        viewDepartmentBudgets();
        break;
      default:
        db.connection.end();
    }
  });
};

const viewDepartments = async () => {
  const [rows] = await db.findAllDepartments();
  console.table(rows);
  start();
};

const viewRoles = async () => {
  const [rows] = await db.findAllRoles();
  console.table(rows);
  start();
};

const viewEmployees = async () => {
  const [rows] = await db.findAllEmployees();
  console.table(rows);
  start();
};

const addDepartment = async () => {
  const answer = await inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'Enter the name of the department:'
  });
  await db.createDepartment(answer);
  console.log('Department added!');
  start();
};

const addRole = async () => {
  const answers = await inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'Enter the title of the role:'
    },
    {
      name: 'salary',
      type: 'input',
      message: 'Enter the salary of the role:'
    },
    {
      name: 'department_id',
      type: 'input',
      message: 'Enter the department ID of the role:'
    }
  ]);
  await db.createRole(answers);
  console.log('Role added!');
  start();
};

const addEmployee = async () => {
  const answers = await inquirer.prompt([
    {
      name: 'first_name',
      type: 'input',
      message: 'Enter the first name of the employee:'
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'Enter the last name of the employee:'
    },
    {
      name: 'role_id',
      type: 'input',
      message: 'Enter the role ID of the employee:'
    },
    {
      name: 'manager_id',
      type: 'input',
      message: 'Enter the manager ID of the employee (if any):'
    }
  ]);
  await db.createEmployee(answers);
  console.log('Employee added!');
  start();
};

const updateEmployeeRole = async () => {
  const employees = await db.findAllEmployees();
  const employeeChoices = employees[0].map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const roles = await db.findAllRoles();
  const roleChoices = roles[0].map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const answers = await inquirer.prompt([
    {
      name: 'employeeId',
      type: 'list',
      message: 'Which employee\'s role do you want to update?',
      choices: employeeChoices
    },
    {
      name: 'roleId',
      type: 'list',
      message: 'What is the new role of the employee?',
      choices: roleChoices
    }
  ]);

  await db.updateEmployeeRole(answers.employeeId, answers.roleId);
  console.log('Employee role updated!');
  start();
};

const updateEmployeeManager = async () => {
  const employees = await db.findAllEmployees();
  const employeeChoices = employees[0].map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const answers = await inquirer.prompt([
    {
      name: 'employeeId',
      type: 'list',
      message: 'Which employee\'s manager do you want to update?',
      choices: employeeChoices
    },
    {
      name: 'managerId',
      type: 'list',
      message: 'Who is the new manager of the employee?',
      choices: employeeChoices
    }
  ]);

  await db.updateEmployeeManager(answers.employeeId, answers.managerId);
  console.log('Employee manager updated!');
  start();
};

const viewEmployeesByManager = async () => {
  const managers = await db.findAllEmployees();
  const managerChoices = managers[0].map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const answer = await inquirer.prompt({
    name: 'managerId',
    type: 'list',
    message: 'Which manager\'s employees do you want to see?',
    choices: managerChoices
  });

  const [rows] = await db.findAllEmployeesByManager(answer.managerId);
  console.table(rows);
  start();
};

const viewEmployeesByDepartment = async () => {
  const departments = await db.findAllDepartments();
  const departmentChoices = departments[0].map(({ id, name }) => ({
    name,
    value: id
  }));

  const answer = await inquirer.prompt({
    name: 'departmentId',
    type: 'list',
    message: 'Which department\'s employees do you want to see?',
    choices: departmentChoices
  });

  const [rows] = await db.findAllEmployeesByDepartment(answer.departmentId);
  console.table(rows);
  start();
};

const removeDepartment = async () => {
  const departments = await db.findAllDepartments();
  const departmentChoices = departments[0].map(({ id, name }) => ({
    name,
    value: id
  }));

  const answer = await inquirer.prompt({
    name: 'departmentId',
    type: 'list',
    message: 'Which department do you want to remove?',
    choices: departmentChoices
  });

  await db.removeDepartment(answer.departmentId);
  console.log('Department removed!');
  start();
};

const removeRole = async () => {
  const roles = await db.findAllRoles();
  const roleChoices = roles[0].map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const answer = await inquirer.prompt({
    name: 'roleId',
    type: 'list',
    message: 'Which role do you want to remove?',
    choices: roleChoices
  });

  await db.removeRole(answer.roleId);
  console.log('Role removed!');
  start();
};

const removeEmployee = async () => {
  const employees = await db.findAllEmployees();
  const employeeChoices = employees[0].map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const answer = await inquirer.prompt({
    name: 'employeeId',
    type: 'list',
    message: 'Which employee do you want to remove?',
    choices: employeeChoices
  });

  await db.removeEmployee(answer.employeeId);
  console.log('Employee removed!');
  start();
};

const viewDepartmentBudgets = async () => {
  const [rows] = await db.viewDepartmentBudgets();
  console.table(rows);
  start();
};

start();
