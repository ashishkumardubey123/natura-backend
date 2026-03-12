import db from "../config/dbconnection";
import env from "dotenv";

import { Request, Response } from "express";
import jwt  from  "jsonwebtoken"
import bcrypt  from  "bcrypt"
import cookie from "cookie-parser"  
import { decode } from './../../node_modules/@types/jsonwebtoken/index.d';

env.config();

const isProduction = process.env.NODE_ENV === "production";

export async function Register (req:Request, res:Response) {
    const {Name, Email, Phone, Role, Password } = req.body
     
    const fields = [ Name, Email, Phone, Role, Password ];
       
     if(fields.some((field)=>(
      !field?.trim() ))){
             return res.status(400).json({
      message: "something is missing in required"
             })
      }

     console.log(Role)
  

 const [isUserExist]:any = await db.query(
      "SELECT * FROM  admins WHERE Email =? or Phone =?",
       [Email, Phone, ]
 )
     
  if(isUserExist.length  !== 0){
       
      if(isUserExist[0].Email === Email){
            return res.status(409).json({
                  message: "Admin Email Already Exist"
            })
      }
    
       else if(isUserExist[0].Phone ===Phone){
            return res.status(409).json({
                  message: "Admin Phone Numebr Already Exist"
            })
      }


  }
      // agar role superadmin hai to check karo
    if (Role === "SuperAdmin") {

      const [rows]: any = await db.query(
        "SELECT * FROM admins WHERE role = ?",
        ["SuperAdmin"]
      )

      // agar pehle se superadmin exist karta hai
      if (rows.length > 0) {
        return res.status(400).json({
          message: "SuperAdmin already exists"
        })
        }
      }
    
   


 const hashPassword = await bcrypt.hash( Password , 10)

const status = (Role === "Admin") ? "pending" : null;

  const [Admin]:any =  await db.query(

     "INSERT INTO admins (Name, Email, Phone, Role, Password, status) VALUES (?, ?, ?, ?, ?, ?)",
  [Name, Email, Phone, Role, hashPassword, status]
);
   const adminId =Admin.insertId




const token = jwt.sign(
  {
    id: adminId,
    Email: Email
  },
  process.env.JWT_SECRET!,
  {
    expiresIn: "3d"
  }
);
   res.cookie("jwt_token", token, {
    httpOnly: true, 
    secure: isProduction, // Localhost pe HTTP hota hai (false), Production pe HTTPS hota hai (true)
    sameSite: isProduction ? "none" : "lax", // Production me agar frontend/backend alag domain pe hain toh 'none' chahiye
    maxAge: 24 * 60 * 60 * 1000 
});


    res.status(201).json({
  message: "Admin registered successfully",
  token: token,
  admin: {
    id: adminId,
    Name,
    Email,
    Phone,
    Role
  }
});
 
        
      
}

export async function Login (req:Request, res:Response) {
           const { Email,  Password } = req.body
     
    const fields = [  Email, Password ];
       
     if(fields.some((field)=>(
      !field?.trim() ))){
             return res.status(400).json({
      message: "something is missing in required"
             })
      }
      
const [admin]:any = await db.query(
      "SELECT * FROM  admins WHERE Email =?  ",
       [Email]
 )

    if(admin.length == 0 ){
      return res.status(401).json({
            message: "admin not found please register "
      })
    }

    if(admin.length > 0){

     if(admin[0].Email != Email){
            return res.status(409).json({
                  message: "Admin Email Not Exist"
            })
      }
      
   

      
      
    }


    const hash = await bcrypt.compare(Password, admin[0].Password )

      if (!hash) {
          return res.status(401).json({
          message: "Password is not currect",
           });            
      }
     
      const token = jwt.sign(
  {
    id: admin[0].AdminID,
    Email: Email
  },
  process.env.JWT_SECRET!,
  {
    expiresIn: "1d"
  }
);
   res.cookie("jwt_token", token, {
    httpOnly: true, 
    secure: isProduction, // Localhost pe HTTP hota hai (false), Production pe HTTPS hota hai (true)
    sameSite: isProduction ? "none" : "lax", // Production me agar frontend/backend alag domain pe hain toh 'none' chahiye
    maxAge: 24 * 60 * 60 * 1000 
});

 
   res.status(200).json({
  message: "Admin logged in successfully",
  token: token,
  admin: {
    id: admin[0].AdminID,
    Name: admin[0].Name,
    Email: admin[0].Email,
    Phone: admin[0].Phone,
    Role: admin[0].Role
  }
});

       
}
 
export async function Logout (req:Request, res:Response) {
      res.clearCookie("jwt_token")
       res.status(200).json({
          message: "Admin logged out successfully",
          

     });
      
}

export async function GetAllAdmins(req: Request, res: Response) {
  try {
    const user = (req as any).user; // Auth middleware se user nikala

    // 1. Security Check: Sirf Super Admin hi sabhi admins ki list dekh sakta hai
    if (user.Role !== "SuperAdmin") {
      return res.status(403).json({
        message: "Access Denied: Only Super Admin can manage admin users",
      });
    }

    // 2. Database se SABHI Admins fetch karo (SuperAdmin ko chhod kar)
    // Humne 'status = pending' wali condition hata di hai taaki sab dikhein
    const [allAdmins]: any = await db.query(
      "SELECT AdminID, Name, Email, Phone, Role, status FROM admins WHERE Role = 'Admin' ORDER BY status DESC"
    );

    // 3. Response bhej do
    return res.status(200).json({
      success: true,
      message: "All admins fetched successfully",
      count: allAdmins.length,
      data: allAdmins
    });

  } catch (error) {
    console.error("Error fetching all admins:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error
    });
  }
}

export async function UpdateAdminStatus(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    // 1. Security Check
    if (user.Role !== "SuperAdmin") {
      return res.status(403).json({
        message: "Access Denied: You are not authorized",
      });
    }

    const { id } = req.params;

    // 2. Pehle current status fetch karo
    const [rows]: any = await db.query(
      "SELECT status FROM admins WHERE AdminID = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const currentStatus = rows[0].status;

    // 3. Toggle Logic: Agar pending hai to live, agar live hai to pending
    const newStatus = currentStatus === "live" ? "pending" : "live";

    // 4. Database mein naya status update karo
    await db.query(
      "UPDATE admins SET status = ? WHERE AdminID = ?",
      [newStatus, id]
    );

    return res.status(200).json({
      success: true,
      message: `Admin status changed from ${currentStatus} to ${newStatus}`,
      newStatus: newStatus // Frontend ko naya status bhej rahe hain
    });

  } catch (error) {
    console.error("Error toggling admin status:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}