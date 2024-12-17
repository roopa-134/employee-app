require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


// Database connection
//const db = mysql.createConnection({
 // host: "localhost",
  //user: "root",
  //password: "Kalaiarasi@1608",
  //database: "EmploymentForm",
//});

db.connect((err) => {
  if (err) {
    console.log("Error occurred while connecting to the database");
    console.log(err);
    process.exit();
  } else {
    console.log("Connected to the database");
  }
});

// API to add a new employee
app.post("/addEmployee", (req, res) => {
  const { name, employee_id, email, phone, department, date_of_joining, role } =
    req.body;

  // Check if the employee ID or email already exists
  const checkQuery = `SELECT * FROM employees WHERE employee_id = ? OR email = ?`;
  db.query(checkQuery, [employee_id, email], (err, result) => {
    if (err) {
      console.log("Error occurred while checking email and employee ID");
      console.log(err);
      return res
        .status(500)
        .json({
          message: "Error occurred while checking email and employee ID",
        });
    }

    if (result.length > 0) {
      return res
        .status(400)
        .json({
          message: "Employee with the same email or employee ID already exists",
        });
    }

    // Insert new employee record
    const insertQuery = `INSERT INTO employees (name, employee_id, email, phone, department, date_of_joining, role) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      insertQuery,
      [name, employee_id, email, phone, department, date_of_joining, role],
      (err) => {
        if (err) {
          console.log("Error occurred while inserting the data");
          console.log(err);
          return res
            .status(500)
            .json({ message: "Error occurred while inserting the data" });
        }

        console.log("Employee successfully added");
        return res.status(201).json({ message: "Employee successfully added" });
      }
    );
  });
});

// API to get all employees
app.get("/getEmployees", (req, res) => {
  const selectQuery = `SELECT * FROM employees`;

  db.query(selectQuery, (err, result) => {
    if (err) {
      console.log("Error occurred while retrieving the data");
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error occurred while retrieving the data" });
    }

    res.status(200).json(result);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
