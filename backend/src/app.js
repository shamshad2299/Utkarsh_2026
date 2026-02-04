import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "../src/routes/userRoutes.js"
import adminRoutes from "../src/routes/adminRoutes.js"
import categoryRoutes from "../src/routes/categoryRoutes.js"
import subCategoryRoutes from "../src/routes/subCategoryRoutes.js"
import { globalErrorHandler } from "./middleWares/errorMiddleWare.js";
import { notFoundHandler } from "./middlewares/notFoundMiddleWare.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({
  extended: true,
  limit: '10kb', // Prevent DoS attacks
  parameterLimit: 50, // Max parameters
  type: 'application/x-www-form-urlencoded'
}));
app.use(cookieParser()); //  MUST
app.get("/" , (req , res)=>{
res.json({
  name : "utkarsh Backend",
  status : "active"
})
})

app.use("/api/v1/auth" , authRoutes);
app.use("/api/admin/auth", adminRoutes);
app.use("/category" , categoryRoutes);
app.use("/subCategory" , subCategoryRoutes);

/* ================= 404 HANDLER ================= */
app.use(notFoundHandler);

/* ================= GLOBAL ERROR HANDLER (ALWAYS LAST) ================= */
app.use(globalErrorHandler)
export { app };
