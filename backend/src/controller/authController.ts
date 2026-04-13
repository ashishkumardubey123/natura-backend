export {};
const db = require("../config/dbconnection");
const env = require("dotenv");
const { Request, Response } = require("express");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookie = require("cookie-parser");

env.config();

async function Register(req: Request, res: Response) {
  try {
    const { Name, Email, Phone, Role, Password } = req.body;

    const fields = [Name, Email, Phone, Role, Password];

    if (fields.some((field) => !field?.trim())) {
      return res.status(400).json({
        message: "something is missing in required",
      });
    }

    const [isUserExist]: any = await db.query(
      "SELECT * FROM admins WHERE Email = ? or Phone = ?",
      [Email, Phone],
    );

    if (isUserExist.length !== 0) {
      if (isUserExist[0].Email === Email) {
        return res.status(409).json({
          message: "Admin Email Already Exist",
        });
      } else if (isUserExist[0].Phone === Phone) {
        return res.status(409).json({
          message: "Admin Phone Number Already Exist",
        });
      }
    }

    if (Role === "SuperAdmin") {
      const [rows]: any = await db.query("SELECT * FROM admins WHERE role = ?", [
        "SuperAdmin",
      ]);

      if (rows.length > 0) {
        return res.status(400).json({
          message: "SuperAdmin already exists",
        });
      }
    }

    const hashPassword = await bcrypt.hash(Password, 10);
    const status = Role === "Admin" ? "pending" : null;

    const [Admin]: any = await db.query(
      "INSERT INTO admins (Name, Email, Phone, Role, Password, status) VALUES (?, ?, ?, ?, ?, ?)",
      [Name, Email, Phone, Role, hashPassword, status],
    );

    const adminId = Admin.insertId;

    const token = jwt.sign(
      {
        id: adminId,
        Email: Email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      },
    );

    res.cookie("jwt_token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Admin registered successfully",
      token: token,
      admin: {
        id: adminId,
        Name,
        Email,
        Phone,
        Role,
      },
    });

  } catch (error: any) {
    console.error("Error in Register:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
}

async function Login(req, res) {
  const { Email, Password } = req.body;

  const fields = [Email, Password];

  if (fields.some((field) => !field?.trim())) {
    return res.status(400).json({
      message: "something is missing in required",
    });
  }

  const [admin] = await db.query("SELECT * FROM  admins WHERE Email =?  ", [
    Email,
  ]);

  if (admin.length == 0) {
    return res.status(401).json({
      message: "admin not found please register ",
    });
  }

  if (admin.length > 0) {
    if (admin[0].Email != Email) {
      return res.status(409).json({
        message: "Admin Email Not Exist",
      });
    }
  }

  const hash = await bcrypt.compare(Password, admin[0].Password);

  if (!hash) {
    return res.status(401).json({
      message: "Password is not currect",
    });
  }

  const token = jwt.sign(
    {
      id: admin[0].AdminID,
      Email: Email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("jwt_token", token, {
    httpOnly: true,
  });

  res.status(200).json({
    message: "Admin logged in successfully",
    token: token,
    admin: {
      id: admin[0].AdminID,
      Name: admin[0].Name,
      Email: admin[0].Email,
      Phone: admin[0].Phone,
      Role: admin[0].Role,
    },
  });
}

async function Logout(req, res) {
  res.clearCookie("jwt_token");
  res.status(200).json({
    message: "Admin logged out successfully",
  });
}

async function GetAllAdmins(req, res) {
  try {
    const user = req.user;

    if (user.Role !== "SuperAdmin") {
      return res.status(403).json({
        message: "Access Denied: Only Super Admin can manage admin users",
      });
    }

    const [allAdmins] = await db.query(
      "SELECT AdminID, Name, Email, Phone, Role, status FROM admins WHERE Role = 'Admin' ORDER BY status DESC",
    );

    return res.status(200).json({
      success: true,
      message: "All admins fetched successfully",
      count: allAdmins.length,
      data: allAdmins,
    });
  } catch (error) {
    console.error("Error fetching all admins:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
}

async function UpdateAdminStatus(req, res) {
  try {
    const user = req.user;

    if (user.Role !== "SuperAdmin") {
      return res.status(403).json({
        message: "Access Denied: You are not authorized",
      });
    }

    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT status FROM admins WHERE AdminID = ?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const currentStatus = rows[0].status;

    const newStatus = currentStatus === "live" ? "pending" : "live";

    await db.query("UPDATE admins SET status = ? WHERE AdminID = ?", [
      newStatus,
      id,
    ]);

    return res.status(200).json({
      success: true,
      message: `Admin status changed from ${currentStatus} to ${newStatus}`,
      newStatus: newStatus,
    });
  } catch (error) {
    console.error("Error toggling admin status:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  Register,
  Login,
  Logout,
  GetAllAdmins,
  UpdateAdminStatus,
};
