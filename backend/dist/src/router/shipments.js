"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { Auth } = require("../middleware/auth");
const { Productshipment, getShipments } = require("../controller/Productshipment");
const upload = require("../middleware/Multerupload");
const router = express.Router();
// POST - Admin uploads Excel file (protected)
router.post("/upload-shipments", Auth, upload.single("file"), Productshipment);
// GET - Public route to fetch all shipments
router.get("/get-shipments", getShipments);
module.exports = router;
