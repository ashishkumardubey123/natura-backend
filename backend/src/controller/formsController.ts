
import db from "../config/dbconnection";
import { Request, Response } from "express";


export async function GeneralInquiry( req: Request, res: Response ) {
  const { Name, Email, Phone, Message } = req.body;

  // 1. Ek array banate hain jo missing fields ko track karega
  const missingFields = [];

  if (!Name?.trim()) missingFields.push("Name");
  if (!Email?.trim()) missingFields.push("Email");
  if (!Phone?.trim()) missingFields.push("Phone");


  if (missingFields.length > 0) {
    return res.status(400).json({
    
      message: `Required fields missing: ${missingFields.join(", ")}`,
      missing: missingFields // Ye array directly bata dega ki kya missing tha
    });
  }



  try {

    await db.query(
      "INSERT INTO general_inquiries (full_name, email, phone, message) VALUES (?, ?, ?, ?)",
      [ Name, Email, Phone, Message ]
    );
    res.status( 200 ).json( {
     
        message: "General Inquiry submitted" } );

  }
  catch ( error:any ) {
    res.status( 500 ).json( { 
       message: error.message
       } );
  }
}

export async function SupplierRegistration( req: Request, res: Response ) {
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


