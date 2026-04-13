export {};
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, uploadDir); 
  },
  filename: function (req: any, file: any, cb: any) {
    // Get original name without extension and remove special characters/spaces
    const originalName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, originalName + path.extname(file.originalname));
  }
});

const Multerupload = multer({ storage: storage });

module.exports = Multerupload;
