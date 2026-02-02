import express from "express"
import { addSubCategory, deleteSubCategory, getAllSubCategories, getSubCategoryByCategory, updateSubCategory } from "../controllers/subEventCategoryController.js";

const router = express.Router();
router.post("/add" ,addSubCategory);
router.get("/get" , getAllSubCategories);
router.get("/get-by-categ/:categoryId" , getSubCategoryByCategory);
router.put("/update/:id" , updateSubCategory);
router.delete("/delete/:id" , deleteSubCategory);


export default router;