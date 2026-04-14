"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx = require("xlsx");
const fs = require("fs");
const db = require("../config/dbconnection"); // Correct path to dbconnection
const Productshipment = async (req, res) => {
    try {
        // 1. Validate that the file actually exists
        if (!req.file || !req.file.path) {
            return res.status(400).json({ error: "No Excel file uploaded" });
        }
        // 2. Parse the Excel File from local disk
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);
        // Clean up local temporary Excel file instantly so server doesn't get flooded
        fs.unlinkSync(req.file.path);
        if (data.length === 0) {
            return res.status(400).json({ error: "Excel sheet is empty" });
        }
        // 3. Map the Excel Data to the Database Columns (Added "Exporter Name")
        const values = data.map((row) => [
            row["Exporter Name"] || null, // <--- NAYA COLUMN YAHAN ADD KIYA HAI
            row["Indian Port"] || null,
            row["Shipment Mode"] || null,
            row["SB Date"] || null,
            row["Product Description"] || null,
            row["Country of Destination"] || null,
            row["Port of Destination"] || null,
            row["Quantity"] || row["Qunatity"] || null,
            row["Unit"] || null
        ]);
        // 4. Create the SQL Query Matching `export_shipments` actual schema (Added exporter_name)
        const sql = `INSERT INTO export_shipments (exporter_name, indian_port, shipment_mode, sb_date, product_description, country_of_destination, port_of_destination, quantity, unit) VALUES ?`;
        // Chunking the payload to prevent MySQL "packet too large" limit from crashing
        // MySQL default max_allowed_packet is typically 1MB or 4MB. 
        const CHUNK_SIZE = 500;
        for (let i = 0; i < values.length; i += CHUNK_SIZE) {
            const chunk = values.slice(i, i + CHUNK_SIZE);
            // Ensure db.query is passing the chunk correctly for bulk insert
            await db.query(sql, [chunk]);
        }
        return res.json({ success: true, message: "Excel uploaded successfully" });
    }
    catch (error) {
        console.error("Error uploading shipment data: ", error.message);
        return res.status(500).json({ error: error.message });
    }
};
const getShipments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;
        const [rows] = await db.query("SELECT * FROM export_shipments ORDER BY created_at DESC LIMIT ? OFFSET ?", [limit, offset]);
        const [countResult] = await db.query("SELECT COUNT(*) as total FROM export_shipments");
        const total = countResult[0].total;
        return res.json({
            success: true,
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error("Error fetching shipments:", error.message);
        return res.status(500).json({ error: error.message });
    }
};
module.exports = { Productshipment, getShipments };
