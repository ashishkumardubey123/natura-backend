import db from "../config/dbconnection";
import { Request, Response } from "express";

export async function GetformsData(req: Request, res: Response) {
  try {
    const [GeneralInquiry] = await db.query("SELECT * FROM general_inquiries");
    const [ExportQuery] = await db.query("SELECT * FROM export_queries");
    const [SupplierRegistration] = await db.query("SELECT * FROM supplier_registrations");
    const [BusinessPartnership] = await db.query("SELECT * FROM business_partners");

    const getRowDate = (row: any) => row.created_at || row.updated_at || row.date || new Date();

    const formatData = (
      rows: any[],
      typeName: string,
      tableName: string,
      mapRow: (row: any) => Record<string, string>
    ) => {
      return rows.map((row) => ({
        id: row.id,
        tableName,
        date: getRowDate(row),
        type: typeName,
        status: row.status || "new",
        data: mapRow(row)
      }));
    };

    let allForms = [
      ...formatData(
        GeneralInquiry as any[],
        "General Inquiry",
        "general_inquiries",
        (row) => ({
          name: row.full_name || "",
          email: row.email || "",
          phone: row.phone || "",
          message: row.message || ""
        })
      ),
      ...formatData(
        ExportQuery as any[],
        "Export Query",
        "export_queries",
        (row) => ({
          name: row.full_name || "",
          email: row.email || "",
          phone: row.phone || "",
          company: row.company_name || "",
          country: row.target_country || "",
          products: row.products_of_interest || "",
          details: row.additional_details || ""
        })
      ),
      ...formatData(
        SupplierRegistration as any[],
        "Supplier Registration",
        "supplier_registrations",
        (row) => ({
          company: row.company_name || "",
          name: row.contact_person || "",
          email: row.email || "",
          phone: row.phone || "",
          supplyCategory: row.supply_category || "",
          companyProfile: row.company_profile || ""
        })
      ),
      ...formatData(
        BusinessPartnership as any[],
        "Business Partnership",
        "business_partners",
        (row) => ({
          name: row.full_name || "",
          email: row.email || "",
          phone: row.phone || "",
          company: row.company_name || "",
          partnership: row.partnership_type || "",
          details: row.proposal_details || ""
        })
      )
    ];

    allForms.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return res.status(200).json(allForms);
  } catch (ERROR) {
    console.error("Error fetching forms:", ERROR);
    return res.status(500).json({
      message: "Data not fetched",
      ERROR
    });
  }
}


// Naya function Status update karne ke liye
export async function UpdateFormStatus(req: Request, res: Response) {
  try {
    const { id } = req.params; // URL se ID aayegi
    const { status, tableName } = req.body; // Frontend se Status aur Table ka naam aayega

    // Security check: SQL Injection se bachne ke liye sirf in tables ko allow karein
    const allowedTables = [
      'general_inquiries', 
      'export_queries', 
      'supplier_registrations', 
      'business_partners'
    ];

    if (!allowedTables.includes(tableName)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid table name provided" 
      });
    }

    // Dynamic SQL Query chalayein (?? use hota hai table/column names ke liye, aur ? values ke liye)
    const [result] = await db.query(
      `UPDATE ?? SET status = ? WHERE id = ?`,
      [tableName, status, id]
    );

    return res.status(200).json({
      success: true,
      message: `Status successfully updated to ${status} in ${tableName}`
    });

  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error
    });
  }
}
