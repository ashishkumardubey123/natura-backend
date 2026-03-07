import db from "../config/dbconnection";
import { Request, Response } from "express";

export async function GetformsData(req: Request, res: Response) {
  try {
    // 1. Data fetch karo
    const [GeneralInquiry] = await db.query("SELECT * FROM general_inquiries");
    const [ExportQuery] = await db.query("SELECT * FROM export_queries");
    const [SupplierRegistration] = await db.query("SELECT * FROM supplier_registrations");
    const [BusinessPartnership] = await db.query("SELECT * FROM business_partners");

    // 2. Ek helper function banate hain jo database ki row ko frontend ke format me map karega
    const formatData = (rows: any[], typeName: string, tableName: string) => {
      return rows.map((row) => ({
        id: row.id,
        tableName: tableName, // Update/Delete karte time kaam aayega ki kis table ka id hai
        date: row.created_at || row.date || new Date(), // Apne DB column ka naam yahan likhen (e.g., created_at)
        type: typeName,
        status: row.status || 'new',
        data: {
          // Note: Apne MySQL database ke column names ko yahan map karein
          firstName: row.first_name || row.firstName || '',
          lastName: row.last_name || row.lastName || '',
          contactPerson: row.contact_person || row.contactPerson || '',
          email: row.email || '',
          phone: row.phone || '',
          company: row.company || '',
          country: row.country || '',
          partnershipType: row.partnership_type || row.partnershipType || '',
          supplyCategory: row.supply_category || row.supplyCategory || '',
          products: row.products || '',
          message: row.message || ''
        }
      }));
    };

    // 3. Sabhi forms ko ek single array me combine karein
    let allForms = [
      ...formatData(GeneralInquiry as any[], "General Inquiry", "general_inquiries"),
      ...formatData(ExportQuery as any[], "Export Query", "export_queries"),
      ...formatData(SupplierRegistration as any[], "Supplier Registration", "supplier_registrations"),
      ...formatData(BusinessPartnership as any[], "Business Partnership", "business_partners")
    ];

    // 4. Data ko Date ke hisaab se sort karein (oldest first, frontend isko reverse() kar raha hai)
    allForms.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 5. Array ko directly send karein, ya object ke andar array bhejein
    // Agar aapka frontend axios use karke seedha `response.data` le raha hai, 
    // toh aap seedha array bhej sakte hain:
    return res.status(200).json(allForms); 
    
    // YA phir (agar API expect karti hai {data: [...] } format)
    // return res.status(200).json({ data: allForms });

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