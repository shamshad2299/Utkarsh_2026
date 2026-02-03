import SubCategory from "../models/subEvent.model.js";
import Category from "../models/eventCategory.model.js";
import slugify from "slugify";

export const addSubCategory = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required",
      });
    }

    // check parent category exists
    const parentCategory = await Category.findById(category);
    if (!parentCategory) {
      return res.status(404).json({
        success: false,
        message: "Parent category not found",
      });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const subCategory = await SubCategory.create({
      title,
      slug,
      category,
      description,
    });

    res.status(201).json({
      success: true,
      message: "SubCategory added successfully",
      subCategory,
    });
  } catch (error) {
    // duplicate slug+category error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "SubCategory with same title already exists in this category",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategory.findByIdAndDelete(id);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SubCategory deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllSubCategories = async (req, res) => {
  try {
    const allSubCategories = await SubCategory
      .find()
      .populate("category")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: allSubCategories.length,
      allSubCategories,
    });
  } catch (error) {
    console.error("Get SubCategories Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sub-categories",
      error: error.message,
    });
  }
};
export const getSubCategoryByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const subCategories = await SubCategory.find({ category: categoryId })
      .sort({ createdAt: -1 })
      .populate("category", "name");

    res.status(200).json({
      success: true,
      count: subCategories.length,
      subCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description } = req.body;
    console.log(id, title, category, description);
    
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    if (title) {
      subCategory.title = title;
      subCategory.slug = slugify(title, { lower: true, strict: true });
    }

    subCategory.description = description;

    await subCategory.save();
    res.status(200).json({
      success: true,
      message: "SubCategory updated successfully",
      subCategory,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "SubCategory with same title already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
