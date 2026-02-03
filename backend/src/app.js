import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import categoryRoutes from "./routes/category.routes.js";

import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";

const app = express();

/* ================= CORS ================= */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

/* ================= BODY PARSERS ================= */
app.use(express.json({ limit: "10kb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
    parameterLimit: 50,
    type: "application/x-www-form-urlencoded",
  })
);

app.use(cookieParser());

/* ================= ROUTES ================= */
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", categoryRoutes);

/* ================= 404 HANDLER ================= */
app.use(notFoundHandler);

/* ================= GLOBAL ERROR HANDLER (ALWAYS LAST) ================= */
app.use(globalErrorHandler);

export { app };
