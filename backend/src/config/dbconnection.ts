"use strict";
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const dbconnection = mysql.createPool({
    host: process.env.MYSQLHOST, // Railway khud provide karega
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: Number(process.env.MYSQLPORT || 3306), // Internal port 3306 hota hai
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = dbconnection;