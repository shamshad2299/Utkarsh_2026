import express from "express";

import {
  addSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategoryByCategory,
  updateSubCategory,
} from "../controllers/subEventCategoryController.js";

import adminAuth from "../middleWares/adminAuth.js";
import { asyncHandler } from "../middleWares/asyncErrorHandlerMiddleWare.js";

const router = express.Router();

/* ===========================
   SubCategory (Admin Only)
   =========================== */

// Create subcategory
router.post("/subcategories", adminAuth, asyncHandler(addSubCategory));

// Get all subcategories
router.get("/subcategories", adminAuth, asyncHandler(getAllSubCategories));

// Get subcategories by category
router.get(
  "/get-by-categ/:categoryId",
  adminAuth,
  asyncHandler(getSubCategoryByCategory),
);

// Update subcategory
router.patch("/subcategories/:id", adminAuth, asyncHandler(updateSubCategory));

// Delete subcategory
router.delete("/subcategories/:id", adminAuth, asyncHandler(deleteSubCategory));

export default router;
