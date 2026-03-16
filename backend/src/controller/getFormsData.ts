const db = require("../config/dbconnection");

async function GetformsData(req, res) {
  try {
    const user = req.user; // Middleware se user data nikala (Role aur status)

    // 1. Check kro: Agar Admin hai aur live nahi hai, toh yahin se rok do
    if (user.Role === "Admin" && user.status !== "live") {
      return res.status(200).json({
        message: "status pending waiting for approvel",
        isPending: true,
        data: []
      });
    }

    // 2. Agar SuperAdmin hai YA Admin 'live' hai, toh ye niche wala code chalega
    const [GeneralInquiry] = await db.query("SELECT * FROM general_inquiries");
    const [ExportQuery] = await db.query("SELECT * FROM export_queries");
    const [SupplierRegistration] = await db.query("SELECT * FROM supplier_registrations");
    const [BusinessPartnership] = await db.query("SELECT * FROM business_partners");

    const getRowDate = (row) => row.created_at || row.updated_at || row.date || new Date();

    const formatData = (
      rows,
      typeName,
      tableName,
      mapRow
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
        GeneralInquiry,
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
        ExportQuery,
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
        SupplierRegistration,
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
        BusinessPartnership,
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
async function UpdateFormStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, tableName } = req.body;

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

module.exports = {
  GetformsData,
  UpdateFormStatus
};