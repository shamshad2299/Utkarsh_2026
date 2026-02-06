// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "../src/routes/userRoutes.js"
import adminRoutes from "../src/routes/adminRoutes.js"
import categoryRoutes from "../src/routes/categoryRoutes.js"
import subCategoryRoutes from "../src/routes/subCategoryRoutes.js"
import eventRoutes from "../src/routes/eventRoutes.js";
import registrationRoutes from "../src/routes/registrationRoutes.js";
import teamRoutes from "../src/routes/teamRoutes.js";
import resultRoutes from "../src/routes/resultRoutes.js";
import foodStallRoutes from "../src/routes/foodStallRoutes.js";
import sponsorshipRoutes from "../src/routes/sponsorshipRoutes.js";
import auditLogRoutes from "../src/routes/auditLogRoutes.js";
import { globalErrorHandler } from "./middleWares/errorMiddleWare.js";
import { notFoundHandler } from "./middlewares/notFoundMiddleWare.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({
  extended: true,
  limit: '10kb', 
  parameterLimit: 50, 
  type: 'application/x-www-form-urlencoded'
}));
app.use(cookieParser());
app.get("/" , (req , res)=>{
res.json({
  name : "utkarsh Backend",
  status : "active"
})
})

app.use("/api/v1/auth" , authRoutes);
app.use("/api/v1/admin/", adminRoutes);
app.use("/category" , categoryRoutes);
app.use("/subCategory" , subCategoryRoutes);
app.use("/events", eventRoutes);
app.use("/registrations", registrationRoutes);
app.use("/teams", teamRoutes);
app.use("/results", resultRoutes);
app.use("/food-stalls", foodStallRoutes);
app.use("/sponsorships", sponsorshipRoutes);
app.use("/api/v1/admin/audit-logs", auditLogRoutes);

/* ================= 404 HANDLER ================= */
app.use(notFoundHandler);

/* ================= GLOBAL ERROR HANDLER (ALWAYS LAST) ================= */
app.use(globalErrorHandler)
export { app };
