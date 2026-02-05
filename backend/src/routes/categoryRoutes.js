// src/routes/categoryRoutes.js
import express from "express";
import {addCategory,deleteCategory,getAllCategories,getCategoryById,updateCategory,} from "../controllers/categoryController.js";
import adminAuth from "../middleWares/adminAuth.js";
import { upload } from "../middleWares/upload.js";
import { asyncHandler } from "../middleWares/asyncErrorHandlerMiddleWare.js";

const router = express.Router();

// Add category
router.post(
  "/add",
  adminAuth,
  upload.single("image"),   // ✅ single image
  asyncHandler(addCategory)
);

// Get all categories
router.get("/get", adminAuth, asyncHandler(getAllCategories));

// Get category by id
router.get("/get/:id", adminAuth, asyncHandler(getCategoryById));

// Update category
router.put("/update/:id",adminAuth,upload.single("image"),asyncHandler(updateCategory),);

// Delete category
router.delete("/delete/:id", adminAuth, asyncHandler(deleteCategory));

export default router;
