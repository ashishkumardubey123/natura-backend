export {};
const express = require("express");
const multer  = require('multer')
const { Auth } = require("../middleware/auth")
const {upload,getProduct} = require("../controller/productController")
const Multerupload  = require("../middleware/Multerupload");

const productrouter = express.Router();
 
productrouter.post("/upload", Auth, Multerupload.fields([{ name: 'image', maxCount: 1 }, { name: 'brochure', maxCount: 1 }]),  upload  )

productrouter.get("/get",  getProduct  )

module.exports = productrouter;