export {};
const db = require("../config/dbconnection");
// Purana import hata kar naya wala lagayein (jo aapne mailer.ts mein banaya hai)
const { sendAdminNotification } = require("../Services/sendingEmail");

// Helper function:  email template generate karne ke liye
const generateEmailTemplate = (title, detailsHtml) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
      <div style="background-color: #2A5C32; color: #ffffff; padding: 20px; text-align: center;">
        <h2 style="margin: 0; letter-spacing: 1px;">Natura Admin Alert</h2>
      </div>
      <div style="padding: 25px; background-color: #fafafa;">
        <p style="font-size: 16px; color: #333;">Hello Admin,</p>
        <p style="font-size: 15px; color: #555;">A new <strong>${title}</strong> has been submitted. Here are the details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; background: #fff; border-radius: 5px; overflow: hidden; border: 1px solid #eee;">
          ${detailsHtml}
        </table>

        <div style="text-align: center; margin-top: 35px; margin-bottom: 10px;">
          <a href="${process.env.BASE_URL || "http://localhost:5000"}/admin" style="background-color: #2A5C32; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 15px;">View in Dashboard</a>
        </div>
      </div>
      <div style="background-color: #f1f1f1; color: #888; text-align: center; padding: 12px; font-size: 12px;">
        &copy; ${new Date().getFullYear()} Natura Alerts. All rights reserved.
      </div>
    </div>
  `;
};

// Helper function: Table row generate karne ke liye
const tableRow = (label, value) => {
  return `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; width: 35%; color: #444;">${label}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333;">${value || 'N/A'}</td>
    </tr>
  `;
};


async function getAdminEmails() {
 try {
    const [admins] = await db.query(
      "SELECT Email FROM admins WHERE Role = 'SuperAdmin' OR status = 'live'"
    );
    return admins.map((adminEmails) => adminEmails.Email);
  } catch (error) {
    console.error("Error fetching admin emails:", error);
    return [];
  }
}

async function GeneralInquiry(req, res) {
  const { Name, Email, Phone, Message } = req.body;

  const missingFields = [];

  if (!Name?.trim()) missingFields.push("Name");
  if (!Email?.trim()) missingFields.push("Email");
  if (!Phone?.trim()) missingFields.push("Phone");

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Required fields missing: ${missingFields.join(", ")}`,
      missing: missingFields
    });
  }

  try {

    await db.query(
      "INSERT INTO general_inquiries (full_name, email, phone, message) VALUES (?, ?, ?, ?)",
      [ Name, Email, Phone, Message ]
    );

    const adminEmails = await getAdminEmails();

   const detailsHtml = 
      tableRow("Full Name", Name) + 
      tableRow("Email Address", Email) + 
      tableRow("Phone Number", Phone) + 
      tableRow("Message", Message);
      
    const emailBody = generateEmailTemplate('General Inquiry', detailsHtml);

    // Send email with dynamic adminEmails
    if (adminEmails.length > 0) {
      sendAdminNotification(adminEmails, 'Natura Alert: New General Inquiry', emailBody);
    }

    res.status(200).json({
        message: "General Inquiry submitted"
    });

  }
  catch (error) {
    res.status(500).json({ 
       message: error.message
    });
  }
}

async function SupplierRegistration(req, res) {
  const { Company, Name, Email, Phone, SupplyCategory, CompanyProfile } = req.body;
  
  const missingFields = [];

  if (!Company?.trim()) missingFields.push("Company");
  if (!Name?.trim()) missingFields.push("Name");
  if (!Email?.trim()) missingFields.push("Email");
  if (!SupplyCategory?.trim()) missingFields.push("SupplyCategory");
  if (!CompanyProfile?.trim()) missingFields.push("CompanyProfile");

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Required fields missing: ${missingFields.join(", ")}`,
      missing: missingFields
    });
  }
  
  try {

    await db.query(
      "INSERT INTO supplier_registrations (company_name, contact_person, email, phone, supply_category, company_profile) VALUES (?, ?, ?, ?, ?, ?)",
      [ Company, Name, Email, Phone, SupplyCategory, CompanyProfile ]
    );

   const adminEmails = await getAdminEmails();

    const detailsHtml = 
      tableRow("Company Name", Company) + 
      tableRow("Contact Person", Name) + 
      tableRow("Email", Email) + 
      tableRow("Phone", Phone) + 
      tableRow("Supply Category", SupplyCategory);

    const emailBody = generateEmailTemplate('Supplier Registration', detailsHtml);

    if (adminEmails.length > 0) {
      sendAdminNotification(adminEmails, 'Natura Alert: New Supplier Registration', emailBody);
    }

    return res.status(200).json({
      message: "Supplier registration submitted successfully"
    });

  } catch (error) {
   
    return res.status(500).json({
      message: error.message
    });
  }
}

async function ExportQuery(req, res) {

 const { Name, Email, Phone, Company, Country, Products, Details } = req.body;

 const missingFields = [];

 if (!Name?.trim()) missingFields.push("Name");
 if (!Email?.trim()) missingFields.push("Email");
 if (!Company?.trim()) missingFields.push("Company");
 if (!Country?.trim()) missingFields.push("Country");
 if (!Products?.trim()) missingFields.push("Products");

 if (missingFields.length > 0) {
   return res.status(400).json({
     message: `Required fields missing: ${missingFields.join(", ")}`,
     missing: missingFields
   });
 }

 try {

  await db.query(
    `INSERT INTO export_queries 
    (full_name, email, phone, company_name, target_country, products_of_interest, additional_details) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [ Name, Email, Phone, Company, Country, Products, Details ]
  );

  const adminEmails = await getAdminEmails();

    const detailsHtml = 
      tableRow("Client Name", Name) + 
      tableRow("Email", Email) + 
      tableRow("Company", Company) + 
      tableRow("Target Country", Country) + 
      tableRow("Products", Products);

    const emailBody = generateEmailTemplate('Export Query', detailsHtml);

    if (adminEmails.length > 0) {
      sendAdminNotification(adminEmails, 'Natura Alert: New Export Query', emailBody);
    }

  return res.status(200).json({
    message: "Supplier registration submitted successfully"
  });

 }
 catch (error) {

  res.status(500).json({
    message: error.message
  });

 }

}

async function BusinessPartnership(req, res) {

 const { Name, Email, Phone, Company, Partnership, Details } = req.body;

 const missingFields = [];

 if (!Name?.trim()) missingFields.push("Name");
 if (!Email?.trim()) missingFields.push("Email");
 if (!Company?.trim()) missingFields.push("Company");
 if (!Partnership?.trim()) missingFields.push("Partnership");
 if (!Details?.trim()) missingFields.push("Details");

 if (missingFields.length > 0) {
   return res.status(400).json({
     message: `Required fields missing: ${missingFields.join(", ")}`,
     missing: missingFields
   });
 }

 try {

 await db.query(
  `INSERT INTO business_partners 
  (full_name, email, phone, company_name, partnership_type, proposal_details)
  VALUES (?, ?, ?, ?, ?, ?)`,
  [Name, Email, Phone, Company, Partnership, Details]
 );

 const adminEmails = await getAdminEmails();

    const detailsHtml = 
      tableRow("From", Name) + 
      tableRow("Email", Email) + 
      tableRow("Company", Company) + 
      tableRow("Partnership Type", Partnership) + 
      tableRow("Proposal Details", Details.substring(0, 100) + '...');

    const emailBody = generateEmailTemplate('Business Partnership Proposal', detailsHtml);

    if (adminEmails.length > 0) {
      sendAdminNotification(adminEmails, 'Natura Alert: New Business Partnership Proposal', emailBody);
    }

 return res.status(200).json({
   message: "Business partnership request submitted successfully"
 });

 } catch (error) {

 console.error(error);

 return res.status(500).json({
   message: "Something went wrong while submitting partnership request"
 });

 }

}

module.exports = {
  GeneralInquiry,
  SupplierRegistration,
  ExportQuery,
  BusinessPartnership
};