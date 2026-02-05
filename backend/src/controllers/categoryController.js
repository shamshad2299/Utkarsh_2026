import Category from "../models/eventCategory.model.js";
import cloudinary from "../utils/cloudinary.js";
import slugify from "slugify";
import { ApiError } from "../utils/ApiError.js";
import { removeLocalFile } from "../utils/removeLocalFile.js";

/* ================= ADD CATEGORY ================= */
export const addCategory = async (req, res) => {
  const { name, description, rules } = req.body;

  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  const existing = await Category.findOne({ name });
  if (existing) {
    throw new ApiError(400, "Category already exists");
  }

  const slug = slugify(name, { lower: true, strict: true });

  let image = null;

  // ✅ single image upload
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "categories",
    });

    image = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    // cleanup local file
    removeLocalFile(req.file.path);
  }

  const category = await Category.create({
    name,
    description,
    rules,
    slug,
    image, // ✅ single image
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

  // ✅ replace image if new one provided
  if (req.file) {
    // delete old image from cloudinary
    if (category.image?.publicId) {
      await cloudinary.uploader.destroy(category.image.publicId);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "categories",
    });

    category.image = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    // cleanup local file
    removeLocalFile(req.file.path);
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

  // ✅ delete image from cloudinary
  if (category.image?.publicId) {
    await cloudinary.uploader.destroy(category.image.publicId);
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
};

