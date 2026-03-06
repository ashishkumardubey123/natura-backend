import db from "../config/dbconnection";
import env from "dotenv";

import { Request, Response } from "express";
import jwt  from  "jsonwebtoken"
import bcrypt  from  "bcrypt"
import cookie from "cookie-parser"  
import { decode } from './../../node_modules/@types/jsonwebtoken/index.d';

env.config();



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
   res.cookie("jwt_token", token,) 


    res.status(201).json({
    message: "Admin registered successfully",
    
     

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
      
const [User]:any = await db.query(
      "SELECT * FROM  admins WHERE Email =?  ",
       [Email]
 )

    if(User.length == 0 ){
      return res.status(409).json({
            message: "admin not found please register "
      })
    }

    if(User.length > 0){

     if(User[0].Email != Email){
            return res.status(409).json({
                  message: "Admin Email Not Exist"
            })
      }
      
   

      
      
    }


    const hash = await bcrypt.compare(Password, User[0].Password )

      if (!hash) {
          return res.status(401).json({
          message: "Password is not currect",
           });            
      }
     
      const token = jwt.sign(
  {
    id: User[0].AdminID,
    Email: Email
  },
  process.env.JWT_SECRET!,
  {
    expiresIn: "1d"
  }
);
   res.cookie("jwt_token", token,) 

 
   const decode =  jwt.verify(token , process.env.JWT_SECRET!)
    res.status(200).json({
      message: "user logedin successfully  ",
      decode
    })

       
}
 
export async function Logout (req:Request, res:Response) {
      res.clearCookie("jwt_token")
       res.status(200).json({
          message: "Admin logged out successfully",
     });
      
}
