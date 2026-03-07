import express from "express";
import dotenv from "dotenv";
import router  from "./router/formsRoute";
import authRouter from "./router/authrouter";
import cookieParser from "cookie-parser";
import CORS  from "cors"

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser())
app.use(CORS({
    origin: 'http://localhost:3000', // Apna exact frontend URL dalein (sirf '*' kaam nahi karega)
    credentials: true,               // <--- YEH TRUE HONA ZAROORI HAI COOKIES KE LIYE
}));
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/admin", authRouter)
app.use("/api/form", router )




export default app;