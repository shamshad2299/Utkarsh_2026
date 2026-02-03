import express from "express";
import {
  getCategories,
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory
} from "../controllers/category.controller.js";

import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

/* Category */
router.get("/categories", getCategories);

/* SubCategory (admin only) */
router.post("/subcategories",adminAuth,createSubCategory);
router.get("/subcategories", getSubCategories);
router.patch("/subcategories/:id",adminAuth,updateSubCategory);
router.delete("/subcategories/:id",adminAuth,deleteSubCategory);

export default router;
