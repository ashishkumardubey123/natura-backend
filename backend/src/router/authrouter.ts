export {};
const express = require("express");

const { 
  Login, 
  Logout, 
  UpdateAdminStatus, 
  GetAllAdmins, 
  Register,
  ForgotPassword,
  VerifyOTP,
  ResetPassword
} = require("../controller/authController");

const { Auth } = require("../middleware/auth");

const authRouter = express.Router();

authRouter.post('/register', Register);
authRouter.post('/login', Login);
authRouter.post('/logout', Logout);
authRouter.get('/pending', Auth, GetAllAdmins);

authRouter.post('/forgot-password', ForgotPassword);
authRouter.post('/verify-otp', VerifyOTP);
authRouter.post('/reset-password', ResetPassword);

authRouter.put('/update-status/:id', Auth, UpdateAdminStatus);

// authRouter.patch('/update-status/:id', Auth, UpdateAdminStatus);

module.exports = authRouter;