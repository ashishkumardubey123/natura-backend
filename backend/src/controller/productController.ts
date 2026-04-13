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

    // const baseUrl = resolveBaseUrl(req);
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
    console.log("BASE_URL from ENV:", process.env.BASE_URL); // Yeh check karein
    const [rows] = await db.query("SELECT * FROM products");
    
    // const baseUrl = resolveBaseUrl(req);
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    
    // const products = rows.map((product: any) => {
    //   return {
    //     ...product,
    //     image: product.image && !product.image.startsWith("http") 
    //       ? `${baseUrl}${product.image.startsWith("/") ? "" : "/"}${product.image}` 
    //       : product.image,
    //     brochure: product.brochure && !product.brochure.startsWith("http") 
    //       ? `${baseUrl}${product.brochure.startsWith("/") ? "" : "/"}${product.brochure}` 
    //       : product.brochure
    //   };
    // });

const products = rows.map((product: any) => {


  return {
    ...product,
    image: product.image ? `${baseUrl}${product.image}` : null,
    brochure: product.brochure ? `${baseUrl}${product.brochure}` : null
  };
});

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
async function getProductFilters(req: Request, res: Response) {
  try {
    // 1. Database se unique Therapy (Wellness Area) nikalo, empty/null values ignore kardo
    const [therapyRows] = await db.query(
      "SELECT DISTINCT therapy FROM products WHERE therapy IS NOT NULL AND therapy != ''"
    );

    // 2. Database se unique Dosage Form (Product Form) nikalo, empty/null values ignore kardo
    const [dosageRows] = await db.query(
      "SELECT DISTINCT dosageForm FROM products WHERE dosageForm IS NOT NULL AND dosageForm != ''"
    );

    // Objects ke array ko simple string ke array me convert karo
    // e.g., [{ therapy: 'Cardiac' }, ...] -> ['Cardiac', ...]
    const therapyFilters = therapyRows.map((row: any) => row.therapy);
    const dosageFilters = dosageRows.map((row: any) => row.dosageForm);

    // 3. JSON format me return karo (Jaisa Context API me expected hai)
    return res.status(200).json({
      therapyFilters,
      dosageFilters
    });

  } catch (error) {
    console.error("Error fetching filters:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { upload, getProduct, getProductFilters };
