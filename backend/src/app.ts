"use strict";
export {};
const express = require("express");
const dotenv = require("dotenv");
const formRoutes = require("./router/formsRoute");
const authRoutes = require("./router/authrouter");
const cookieParser = require("cookie-parser");
const productrouter = require("./router/productRouter")
const cors = require("cors");
const path = require("path");  // ← add karo
const shipment = require("./router/shipments")
const countryRouter = require("./router/Country")
dotenv.config();

// server.ts ya app.ts mein ye line honi chahiye


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


// Routes
app.use("/api/admin", authRoutes);
app.use("/api/form", formRoutes);
app.use("/api/product", productrouter);
app.use("/api/shipments", shipment);
app.use("/api/contry", countryRouter)

 app.get("/" ,(req:any,res:any)=>{
    res.send("server is running 🚀 ")
 })

// ✅ Backend static uploads folder
// Pura path.join(__dirname...) hata kar ye likhein:
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// ✅ Frontend static files
app.use(express.static(path.join(__dirname, "../out")));

// ✅ Catch-all
app.get("/{*path}", function(req: any, res: any) {
  res.sendFile(path.join(__dirname, "../out", "index.html"));
});

module.exports = app;
