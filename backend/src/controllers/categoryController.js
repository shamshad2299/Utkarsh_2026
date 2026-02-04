import Category from "../models/eventCategory.model.js";
import cloudinary from "../utils/cloudinary.js";
import slugify from "slugify";
import { ApiError } from "../utils/ApiError.js";


/* ================= ADD CATEGORY ================= */
export const addCategory = async (req, res) => {
  const { name, description, rules } = req.body;

  if (!name || !req.file) {
    throw new ApiError(400, "Name and image are required");
  }

  const existing = await Category.findOne({ name });
  if (existing) {
    throw new ApiError(400, "Category already exists");
  }

  const slug = slugify(name, { lower: true, strict: true });

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "categories",
  });

  const category = await Category.create({
    name,
    description,
    rules,
    slug,
    image: result.secure_url,
    imagePublicId: result.public_id, // 🔥 future delete ke liye
  });

  res.status(201).json({
    success: true,
    message: "Category added successfully",
    data: category,
  });
};

/* ================= GET ALL CATEGORIES ================= */
export const getAllCategories = async (req, res) => {
  const categories = await Category.find()
    .sort({ createdAt: -1 })
    .select("name description rules image slug");

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
};

/* ================= GET CATEGORY BY ID ================= */
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res.status(200).json({
    success: true,
    data: category,
  });
};

/* ================= UPDATE CATEGORY ================= */
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, rules } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // update image
  if (req.file) {
    // delete old image (🔥 important)
    if (category.imagePublicId) {
      await cloudinary.uploader.destroy(category.imagePublicId);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "categories",
    });

    category.image = result.secure_url;
    category.imagePublicId = result.public_id;
  }

  if (name) {
    category.name = name;
    category.slug = slugify(name, { lower: true, strict: true });
  }

  if (description !== undefined) category.description = description;
  if (rules !== undefined) category.rules = rules;

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
};

/* ================= DELETE CATEGORY ================= */
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // delete image from cloudinary
  if (category.imagePublicId) {
    await cloudinary.uploader.destroy(category.imagePublicId);
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
};
