
import db from "../config/dbconnection";
import { Request, Response } from "express";


export async function GeneralInquiry( req: Request, res: Response ) {
  const { Name, Email, Phone, Message } = req.body;
  // Basic validation
  if (!Name?.trim() ||  !Email?.trim() ||  !Phone?.trim() ) {
    return res.status(400).json({
      message: "something is missing in required"
    });
  }

  try {

    await db.query(
      "INSERT INTO general_inquiries (full_name, email, phone, message) VALUES (?, ?, ?, ?)",
      [ Name, Email, Phone, Message ]
    );
    res.status( 200 ).json( { success: true, message: "General Inquiry submitted" } );

  }
  catch ( error:any ) {
    res.status( 500 ).json( { 
       message: error.message
       } );
  }
}

export async function SupplierRegistration( req: Request, res: Response ) {
  const { Company, Name, Email, Phone, SupplyCategory, CompanyProfile } = req.body;
  
  // Basic validation
  if (!Name?.trim() || !Email?.trim() || !Phone?.trim() || !Company?.trim() || !CompanyProfile?.trim()) {
    return res.status(400).json({
    
      message: "something is missing in required"
    });
  }
  
  try {

    await db.query(
      "INSERT INTO supplier_registrations (company_name, contact_person, email, phone, supply_category, company_profile) VALUES (?, ?, ?, ?, ?, ?)",
      [ Company, Name, Email, Phone, SupplyCategory, CompanyProfile ]
    );

    return res.status( 200 ).json( {
  
      message: "Supplier registration submitted successfully"
    } );

  } catch ( error:any ) {
   
    return res.status( 500 ).json( {
      message: error.message
      
      } );
  }
}

export async function ExportQuery( req: Request, res: Response ) {
 const { Name, Email, Phone, Company, Country, Products, Details } = req.body;

// Basic validation
if (
  !Name?.trim() ||
  !Email?.trim() ||
  !Phone?.trim() ||
  !Company?.trim() ||
  !Products?.trim()
) {
  return res.status(400).json({
    message: "All required fields must be filled"
  });
}

  try {

    await db.query(
      `INSERT INTO export_queries 
  (full_name, email, phone, company_name, target_country, products_of_interest, additional_details) 
  VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ Name, Email, Phone, Company, Country, Products, Details ]
    );
    return res.status( 200 ).json( {
      message: "Supplier registration submitted successfully"
    } );
  }
  catch ( error:any) {

    res.status( 500 ).json( {
      message: error.message

      });
  }
}

export async function BusinessPartnership(req: Request, res: Response) {
  const { Name, Email, Phone, Company, Partnership, Details } = req.body;

  // Basic validation
   if (!Name?.trim() || !Email?.trim() || !Phone?.trim() || !Company?.trim() || !Details?.trim() || ! Partnership?.trim()) {
    return res.status(400).json({
      message: "something is missing in required"
    });
  }

  try {
   await db.query(
  `INSERT INTO business_partners 
  (full_name, email, phone, company_name, partnership_type, proposal_details)
  VALUES (?, ?, ?, ?, ?, ?)`,
  [Name, Email, Phone, Company, Partnership, Details]
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


