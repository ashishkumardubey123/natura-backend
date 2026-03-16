const db = require("../config/dbconnection");
const { sendMail } = require("../Services/sendingEmail");

async function getAdminEmails() {
 try {
    const [admins] = await db.query(
      "SELECT Email FROM admins WHERE Role = 'SuperAdmin' OR status = 'live'"
    );
    return admins.map((a) => a.Email);
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

    sendMail(
      'Natura Alert: New General Inquiry',
      `<div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #2A5C32;">New General Inquiry Received</h2>
        <p><strong>Name:</strong> ${Name}</p>
        <p><strong>Email:</strong> ${Email}</p>
        <p><strong>Phone:</strong> ${Phone || 'N/A'}</p>
        <p><strong>Message:</strong> ${Message || 'No message'}</p>
        <hr />
        <p style="font-size: 12px; color: #777;">View full details on the Natura Admin Console.</p>
        <hr/>
        <a href="http://localhost:3000/admin" style="background:#2A5C32; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Open Dashboard</a>
      </div>`
    );

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

    sendMail(
      'Natura Alert: New Supplier Registration',
      `<div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #2A5C32;">New Supplier Request</h2>
        <p><strong>Company:</strong> ${Company}</p>
        <p><strong>Contact Person:</strong> ${Name}</p>
        <p><strong>Category:</strong> ${SupplyCategory}</p>
        <p><strong>Email:</strong> ${Email}</p>
        <hr />
        <p style="font-size: 12px; color: #777;">Please log in to approve or review the supplier profile.</p>
        <hr/>
        <a href="http://localhost:3000/admin" style="background:#2A5C32; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Open Dashboard</a>
      </div>`
    );

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

  sendMail(
      'Natura Alert: New Export Query',
      `<div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #2A5C32;">New Export Query Received</h2>
        <p><strong>Client:</strong> ${Name}</p>
        <p><strong>Company:</strong> ${Company}</p>
        <p><strong>Target Country:</strong> ${Country}</p>
        <p><strong>Products:</strong> ${Products}</p>
        <hr />
        <p style="font-size: 12px; color: #777;">Check the Export Management section in your dashboard.</p>
        <hr/>
        <a href="http://localhost:3000/admin" style="background:#2A5C32; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Open Dashboard</a>
      </div>`
    );

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

 sendMail(
      'Natura Alert: New Business Partnership Proposal',
      `<div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #2A5C32;">New Partnership Proposal</h2>
        <p><strong>From:</strong> ${Name}</p>
        <p><strong>Company:</strong> ${Company}</p>
        <p><strong>Partnership Type:</strong> ${Partnership}</p>
        <hr />
        <p><strong>Proposal Snippet:</strong> ${Details.substring(0, 100)}...</p>
        <hr/>
        <a href="http://localhost:3000/admin" style="background:#2A5C32; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Open Dashboard</a>
      </div>`
    );

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