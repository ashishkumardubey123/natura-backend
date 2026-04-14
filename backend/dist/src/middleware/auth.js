"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Request, Response, NextFunction } = require("express");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const dotenv = require("dotenv");
const db = require("../config/dbconnection");
dotenv.config();
// Middleware to check authentication
// cookie metod for varifying token
async function Auth(req, res, next) {
    const token = req.cookies.jwt_token;
    if (!token) {
        return res.status(401).json({
            message: "Admin not Logedin, Unauthorized access"
        });
    }
    let decode = null;
    try {
        decode = jwt.verify(token, process.env.JWT_SECRET);
        // Database se Role aur Status fetch karo
        const [rows] = await db.query("SELECT Role, status FROM admins WHERE AdminID = ?", [decode.id]);
        if (rows.length === 0)
            return res.status(401).json({ message: "User not found" });
        // User ki info 'req' object mein daal do taaki controller (GetformsData) ise use kar sake
        req.user = {
            id: decode.id,
            Role: rows[0].Role,
            status: rows[0].status
        };
    }
    catch (error) {
        return res.status(401).json({
            message: "user is not authorized"
        });
    }
    next();
}
module.exports = { Auth };
