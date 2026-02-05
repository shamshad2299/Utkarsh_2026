// import SubCategory from "../models/subEvent.model.js"
// import { ApiError } from "../utils/ApiError.js";

// /* ================= CREATE SUBCATEGORY ================= */
// export const createSubCategory = async (req, res) => {
//   const { title, category } = req.body;

//   if (!title || !category) {
//     throw new ApiError(400, "title and category are required");
//   }

//   const isValidCategory = EVENT_CATEGORIES.some(
//     c => c.key === category
//   );

//   if (!isValidCategory) {
//     throw new ApiError(400, "Invalid category");
//   }

//   const subCategory = await SubCategory.create({
//     title,
//     category
//   });

//   res.status(201).json({
//     success: true,
//     data: subCategory
//   });
// };

// /* ================= GET SUBCATEGORIES ================= */
// export const getSubCategories = async (req, res) => {
//   const filter = { isDeleted: false };

//   if (req.query.category) {
//     filter.category = req.query.category;
//   }

//   const subCategories = await SubCategory.find(filter)
//     .sort({ title: 1 });

//   res.status(200).json({
//     success: true,
//     data: subCategories
//   });
// };

// /* ================= UPDATE SUBCATEGORY ================= */
// export const updateSubCategory = async (req, res) => {
//   const { title, isActive } = req.body;

//   const subCategory = await SubCategory.findOneAndUpdate(
//     { _id: req.params.id, isDeleted: false },
//     { title, isActive },
//     { new: true }
//   );

//   if (!subCategory) {
//     throw new ApiError(404, "SubCategory not found");
//   }

//   res.status(200).json({
//     success: true,
//     data: subCategory
//   });
// };

// /* ================= DELETE SUBCATEGORY ================= */
// export const deleteSubCategory = async (req, res) => {
//   const subCategory = await SubCategory.findOneAndUpdate(
//     { _id: req.params.id, isDeleted: false },
//     { isDeleted: true, isActive: false },
//     { new: true }
//   );

//   if (!subCategory) {
//     throw new ApiError(404, "SubCategory not found");
//   }

//   res.status(200).json({
//     success: true,
//     message: "SubCategory deleted"
//   });
// };