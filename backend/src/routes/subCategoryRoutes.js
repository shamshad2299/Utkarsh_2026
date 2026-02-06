// src/routes/subCategoryRoutes.js
import express from "express";
import {addSubCategory,deleteSubCategory,getAllSubCategories,getSubCategoryByCategory,updateSubCategory,} from "../controllers/subEventCategoryController.js";
import adminAuth from "../middleWares/adminAuth.js";
import { asyncHandler } from "../middleWares/asyncErrorHandlerMiddleWare.js";

const router = express.Router();

/* =========================== SubCategory  =========================== */

// Create subcategory
router.post("/add", adminAuth, asyncHandler(addSubCategory));

// Get all subcategories
router.get("/", adminAuth, asyncHandler(getAllSubCategories));

// Get subcategories by category
router.get("/:categoryId",adminAuth,asyncHandler(getSubCategoryByCategory),);

// Update subcategory
router.patch("/:id", adminAuth, asyncHandler(updateSubCategory));

// Delete subcategory
router.delete("/:id", adminAuth, asyncHandler(deleteSubCategory));

export default router;
