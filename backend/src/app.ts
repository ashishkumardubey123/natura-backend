const express = require("express");
const dotenv = require("dotenv");
const router = require("./router/formsRoute");
const authRouter = require("./router/authrouter");
const cookieParser = require("cookie-parser");
const CORS = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(CORS({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/admin", authRouter);
app.use("/api/form", router);

module.exports = app;