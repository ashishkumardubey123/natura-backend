import { Request, Response, NextFunction   } from "express";
import jwt from "jsonwebtoken";
import  cookie  from 'cookie-parser';
import  dotenv   from "dotenv";
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

     }catch(error){
         return res.status(401).json({
            message: "user is not authorized"
         })
     }

          next()      
     
}


// the Headers method for verifying token


// const authenticateToken = async (req, res, next) => {
//     const authorizationHeader = req.headers.authorization;

//     if (!authorizationHeader) {
//         return res.status(401).json({ success:false,message: 'Unauthorized - Missing token' });
//     }

//     // const token = authorizationHeader.slice(7);
//     const token = authorizationHeader.split(" ")[1];

//     // Verify and decode the token (you need to implement this function)
    
//     const user = await verifyAdminToken(token);

//     if (!user) {
//         return res.status(401).json({ success:false,message: 'Unauthorized - Invalid token' });
//     }

//     // Attach the user to the request for later use
//     req.user = user;
//     console.log(user)
//     next();
// };



// const verifyAdminToken = require('./verifyAdminToken.js');


// const verifyAdminToken = async (token) => {
   
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log(decoded)
//         // Check if the user exists in the database
//         const query = 'SELECT * FROM userprofile WHERE UserId = ?';
//         const params = [decoded.userId];

//         return new Promise((resolve, reject) => {
//             db.query(query, params, (error, results) => {
//                 if (error) {
//                     console.error('Error executing query:', error);
//                     reject(error);
//                     return;
//                 }

//                 if (!results || results.length === 0) {
//                     console.error('User not found in the database');
//                     resolve(null);
//                     return;
//                 }

//                 const user = results[0]; // Assuming user data is in the first row
//                 // The user object contains the user information
//                 resolve(user);
//             });
//         });
//     } catch (error) {
//         console.error('Error verifying token:', error);
//         return null;
//     }
// };

