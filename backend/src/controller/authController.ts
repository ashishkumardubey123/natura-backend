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

// Basic validation
//   if (!Name?.trim() ||  !Email?.trim() ||  !Phone?.trim() || !Role?.trim() ||!Password?.trim()  ) {
//     return res.status(400).json({
      
//       message: "something is missing in required"
//     });
// }

  

 const [isUserExist]:any = await db.query(
      "SELECT * FROM  admins WHERE Email =? or Phone =? or Name =?",
       [Email, Phone, Name]
 )
     
  if(isUserExist.length  !== 0){
       
      if(isUserExist[0].Email === Email){
            return res.status(409).json({
                  message: "Admin Email Already Exist"
            })
      }
      if(isUserExist[0].Name === Name){
            return res.status(409).json({
                  message : "Admin Name is Already Exist"
            })
      }
      if(isUserExist[0].Phone ===Phone){
            return res.status(409).json({
                  message: "Admin Phone Numebr Already Exist"
            })
      }


  }

 const hashPassword = await bcrypt.hash( Password , 10)



  const [Admin]:any =  await db.query(

      "INSERT INTO admins (Name, Email, Phone ,Role ,Password) VALUES (?,?,?,?,?) ",
              [Name,Email, Phone, Role, hashPassword]
                  
  )
const token = jwt.sign(
  {
    id: Admin.insertId,
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
    id: Admin.insertId,
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
