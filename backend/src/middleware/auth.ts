import { Request, Response, NextFunction   } from "express";
import jwt from "jsonwebtoken";
import  cookie  from 'cookie-parser';
import  dotenv   from "dotenv";
import db from "../config/dbconnection";
dotenv.config();

// Middleware to check authentication


// cookie metod for varifying token

export async function Auth (req:Request,res: Response, next: NextFunction ) {
 
      const token =  req.cookies.jwt_token

         if (!token) {
        return res.status(401).json({
            message: "Admin not Logedin, Unauthorized access"
        })
    }

     let decode =null 
     try{
            decode = jwt.verify(token, process.env.JWT_SECRET!)

            // Database se Role aur Status fetch karo
        const [rows]: any = await db.query(
            "SELECT Role, status FROM admins WHERE AdminID = ?", 
            [decode.id]
        );

        if (rows.length === 0) return res.status(401).json({ message: "User not found" });

        // User ki info 'req' object mein daal do taaki controller (GetformsData) ise use kar sake
        (req as any).user = {
            id: decode.id,
            Role: rows[0].Role,
            status: rows[0].status
        };

     }catch(error){
         return res.status(401).json({
            message: "user is not authorized"
         })
     }

          next()      
     
}
