//index.js
import dotenv from "dotenv";
dotenv.config();
// console.log("mongo db uri",process.env.MONGO_URI)

import connectDB from "./db/connectDB.js";
import { app } from "./app.js";


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  });
