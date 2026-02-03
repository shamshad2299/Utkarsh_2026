import Category from "../models/eventCategory.model.js";
import cloudinary from "../utils/cloudinary.js";
import slugify from "slugify";

export const addCategory = async (req, res) => {
  try {
    const { name, description, rules } = req.body;

    if (!name || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Name and image are required",
      });
    }

    // check duplicate
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
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
    });

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .select("name description rules image slug");

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, rules } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // update image if new image uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
      });
      category.image = result.secure_url;
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }

    category.description = description;
    category.rules = rules;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteCategory= async( req , res)=>{
  try {
     const id = req.params.id;
     await Category.findByIdAndDelete(id);
     if (!Category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    
  } 
}


