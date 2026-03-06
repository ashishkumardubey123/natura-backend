
import db from "../config/dbconnection";
import { Request, Response } from "express";




export async function GetformsData( req: Request, res: Response ) {
     
  try{
     const [GeneralInquiry] = await db.query(
       " SELECT * FROM general_inquiries"
     );
     const [ExportQuery] = await db.query(
       " SELECT * FROM export_queries"
     );
     const [SupplierRegistration] = await db.query(
       " SELECT * FROM supplier_registrations"
     );
     const [BusinessPartnership] = await db.query(
       " SELECT * FROM business_partners"
     );
     return res.status(200).json({
        message: "All form deta retrive",
        data:{
          GeneralInquiry,
          ExportQuery,
          SupplierRegistration,
          BusinessPartnership
        }

     })

  }catch(ERROR){
    return res.status(500).json({
      message: "deta not fatchd",
      ERROR
    })
  }
   
  
}