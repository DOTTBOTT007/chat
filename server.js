const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Database connection (replace with your Aiven MySQL connection details)
const db = mysql.createConnection({
    host: "your_aiven_host",
    user: "your_aiven_user",
    password: "your_aiven_password",
    database: "your_aiven_database"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle order form submission
app.post("/submit-order", (req, res) => {
    const { category, sku, company, person, amount, remarks, unit, orderDate } = req.body;

    const query = "INSERT INTO orders (category, sku, company, person, amount, remarks, unit, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [category, sku, company, person, amount, remarks, unit, orderDate], (err, result) => {
        if (err) throw err;
        res.send("Order submitted successfully!");
    });
});

// Handle expense form submission
app.post("/submit-expense", (req, res) => {
    const { expenseCategory, expenseAmount, expenseDate, expensePerson } = req.body;

    const query = "INSERT INTO expenses (category, amount, date, person) VALUES (?, ?, ?, ?)";
    db.query(query, [expenseCategory, expenseAmount, expenseDate, expensePerson], (err, result) => {
        if (err) throw err;
        res.send("Expense submitted successfully!");
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
