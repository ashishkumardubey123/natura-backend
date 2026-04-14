"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const fs = require("fs");
const path = require("path");
// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Get original name without extension and remove special characters/spaces
        const originalName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9]/g, '-');
        cb(null, originalName + path.extname(file.originalname));
    }
});
const Multerupload = multer({ storage: storage });
module.exports = Multerupload;
