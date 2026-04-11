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

    const imagePath = `/uploads/${imageFile.filename}`;
    const brochurePath = brochureFile ? `/uploads/${brochureFile.filename}` : null;

    const query = `
      INSERT INTO products 
      (name, genericName, therapy, dosageForm, packaging, description, tag, image, brochure) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [name, genericName, therapy, dosageForm, packaging, description, tag, imagePath, brochurePath]);

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const imageUrl = `${baseUrl}${imagePath}`;
    const brochureUrl = brochurePath ? `${baseUrl}${brochurePath}` : null;

    return res.status(201).json({ message: "Product successfully added!", imageUrl, brochureUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getProduct(req: Request, res: Response) {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    
    const products = rows.map((product: any) => {
      return {
        ...product,
        image: product.image && !product.image.startsWith("http") 
          ? `${baseUrl}${product.image.startsWith("/") ? "" : "/"}${product.image}` 
          : product.image,
        brochure: product.brochure && !product.brochure.startsWith("http") 
          ? `${baseUrl}${product.brochure.startsWith("/") ? "" : "/"}${product.brochure}` 
          : product.brochure
      };
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { upload, getProduct };