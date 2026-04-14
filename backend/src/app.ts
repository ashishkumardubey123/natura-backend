"use strict";

const express = require("express");
const dotenv = require("dotenv");
const formRoutes = require("./router/formsRoute");
const authRoutes = require("./router/authrouter");
const cookieParser = require("cookie-parser");
const productrouter = require("./router/productRouter");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const shipment = require("./router/shipments");
const countryRouter = require("./router/Country");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// CORS Setup
const allowedOrigins = [
  'http://localhost:3000',
  'https://doaguru-natura.vercel.app',
  'https://jaipurdentalhospital.dentalguru.software'
];

app.use(cors({
  origin: function (origin: any, callback: any) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Routes
app.use("/api/admin", authRoutes);
app.use("/api/form", formRoutes);
app.use("/api/product", productrouter);
app.use("/api/shipments", shipment);
app.use("/api/contry", countryRouter);

app.get("/", (req: any, res: any) => {
  res.send("Server is running 🚀");
});

// Static Files (NOTE: Vercel par ye problematic ho sakta hai)
const uploadsDir = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsDir));

// Vercel ke liye export
module.exports = app;