import express from "express";
import { Login, Logout, UpdateAdminStatus, GetAllAdmins, Register } from "../controller/authController";
import { Auth } from "../middleware/auth";





const authRouter = express.Router()

authRouter.post('/register',Register)
authRouter.post('/login', Login)
authRouter.post('/logout', Logout)
authRouter.get('/pending', Auth , GetAllAdmins)
authRouter.put('/update-status/:id', Auth, UpdateAdminStatus);


// authRouter.patch('/update-status/:id', Auth, UpdateAdminStatus);


export default authRouter