import express from "express"
import { addCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/categoryController.js";

const router = express.Router();
router.post("/add" ,addCategory);
router.get("/get", getAllCategories);
router.get("/get/:id" , getCategoryById);
router.put("/update/:id" , updateCategory);
router.delete("/delete/:id" , deleteCategory);

export default router;