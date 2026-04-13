export {};
const db = require('../config/dbconnection');
const { Request, Response } = require("express");


const getAllCountries = async (req: Request, res: Response) => {
  try {
    // 💡 Nayi SQL Query: Ye sirf wahi countries layegi jo export_shipments me hain
    const query = `
      SELECT DISTINCT c.country_name, c.iso2_code, c.latitude, c.longitude 
      FROM countries c
      INNER JOIN export_shipments e 
      ON UPPER(c.country_name) = UPPER(e.country_of_destination)
    `;

    const [rows] = await db.query(query);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
};

module.exports = {
    getAllCountries
}
