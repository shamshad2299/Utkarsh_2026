import { SubCategory } from "../models/subCategory.model.js";
import { ApiError } from "../utils/ApiError.js";

/* ================= CATEGORY ENUM ================= */
export const EVENT_CATEGORIES = [
  { key: "cultural", label: "Cultural" },
  { key: "sports", label: "Sports" },
  { key: "technical", label: "Technical" },
  { key: "fine_arts", label: "Fine Arts" },
  { key: "literary", label: "Literary" },
  { key: "hotel_management", label: "Hotel Management" },
  { key: "others", label: "Others" }
];

/* ================= GET CATEGORIES ================= */
export const getCategories = async (req, res) => {
  res.status(200).json({
    success: true,
    data: EVENT_CATEGORIES
  });
};

/* ================= CREATE SUBCATEGORY ================= */
export const createSubCategory = async (req, res) => {
  const { name, category } = req.body;

  if (!name || !category) {
    throw new ApiError(400, "Name and category are required");
  }

  const isValidCategory = EVENT_CATEGORIES.some(
    c => c.key === category
  );

  if (!isValidCategory) {
    throw new ApiError(400, "Invalid category");
  }

  const subCategory = await SubCategory.create({
    name,
    category
  });

  res.status(201).json({
    success: true,
    data: subCategory
  });
};

/* ================= GET SUBCATEGORIES ================= */
export const getSubCategories = async (req, res) => {
  const filter = { isDeleted: false };

  if (req.query.category) {
    filter.category = req.query.category;
  }

  const subCategories = await SubCategory.find(filter)
    .sort({ name: 1 });

  res.status(200).json({
    success: true,
    data: subCategories
  });
};

/* ================= UPDATE SUBCATEGORY ================= */
export const updateSubCategory = async (req, res) => {
  const { name, isActive } = req.body;

  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { name, isActive },
    { new: true }
  );

  if (!subCategory) {
    throw new ApiError(404, "SubCategory not found");
  }

  res.status(200).json({
    success: true,
    data: subCategory
  });
};

/* ================= DELETE SUBCATEGORY ================= */
export const deleteSubCategory = async (req, res) => {
  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { isDeleted: true, isActive: false },
    { new: true }
  );

  if (!subCategory) {
    throw new ApiError(404, "SubCategory not found");
  }

  res.status(200).json({
    success: true,
    message: "SubCategory deleted"
  });
};
