export {};
const db = require("../config/dbconnection");
const { Request, Response } = require("express");

async function upload(req: Request & { files?: any }, res: Response) {
  try {
    const { name, genericName, therapy, dosageForm, packaging, description, tag } = req.body;

    const files = req.files || {};
    const imageFile = files["image"]?.[0];
    const brochureFile = files["brochure"]?.[0];

    if (!imageFile) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const imageUrl = `${baseUrl}/uploads/${imageFile.filename}`;
    const brochureUrl = brochureFile ? `${baseUrl}/uploads/${brochureFile.filename}` : null;

    const query = `
      INSERT INTO products 
      (name, genericName, therapy, dosageForm, packaging, description, tag, image, brochure) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [name, genericName, therapy, dosageForm, packaging, description, tag, imageUrl, brochureUrl]);

    return res.status(201).json({ message: "Product successfully added!", imageUrl, brochureUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getProduct(req: Request, res: Response) {
  try {
    const result = await db.query("SELECT * FROM products");
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { upload, getProduct };