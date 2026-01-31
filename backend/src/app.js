import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "../src/routes/userRoutes.js"

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

app.use("/api/v1/auth" , authRoutes);


export { app };
