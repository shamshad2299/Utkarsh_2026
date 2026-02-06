// src/routes/categoryRoutes.js
import express from "express";
import {addCategory,deleteCategory,getAllCategories,getCategoryById,updateCategory,} from "../controllers/categoryController.js";
import adminAuth from "../middleWares/adminAuth.js";
import { upload } from "../middleWares/upload.js";
import { asyncHandler } from "../middleWares/asyncErrorHandlerMiddleWare.js";

const router = express.Router();

// public routes for categories

// Get category by id
router.get("/:id", asyncHandler(getCategoryById));
// Get all categories
router.get("/", asyncHandler(getAllCategories));


//admin routes for categories
// Add category
router.post("/add",adminAuth,upload.single("image"),asyncHandler(addCategory),);

// Update category
router.put("/update/:id",adminAuth,upload.single("image"),asyncHandler(updateCategory),);

// Delete category
router.delete("/delete/:id", adminAuth, asyncHandler(deleteCategory));

export default router;
