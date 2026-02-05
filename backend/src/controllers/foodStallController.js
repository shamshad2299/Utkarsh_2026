// src/controllers/foodStallController.js
import { FoodStall } from "../models/foodStall.model.js";
import { ApiError } from "../utils/ApiError.js";

/* ================= CREATE FOOD STALL REQUEST (USER) ================= */
export const createFoodStall = async (req, res) => {
  const {
    businessName,
    email,
    foodItems,
    ownerName,
    phoneNumber,
    permanentAddress,
    numberOfStalls,
  } = req.body;

  if (
    !businessName ||
    !email ||
    !foodItems ||
    !ownerName ||
    !phoneNumber ||
    !permanentAddress ||
    !numberOfStalls
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const stall = await FoodStall.create({
    businessName,
    email,
    foodItems,
    ownerName,
    phoneNumber,
    permanentAddress,
    numberOfStalls,
  });

  res.status(201).json({
    success: true,
    message: "Food stall request submitted",
    data: stall,
  });
};

/* ================= GET MY FOOD STALL REQUESTS ================= */
export const getMyFoodStalls = async (req, res) => {
  const stalls = await FoodStall.find({
    email: req.user.email,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: stalls.length,
    data: stalls,
  });
};

/* ================= GET ALL FOOD STALLS (ADMIN) ================= */
export const getAllFoodStalls = async (req, res) => {
  const { status } = req.query;

  const filter = { isDeleted: false };
  if (status) filter.status = status;

  const stalls = await FoodStall.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: stalls.length,
    data: stalls,
  });
};

/* ================= UPDATE FOOD STALL STATUS (ADMIN) ================= */
export const updateFoodStallStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const stall = await FoodStall.findById(id);
  if (!stall || stall.isDeleted) {
    throw new ApiError(404, "Food stall not found");
  }

  stall.status = status;
  await stall.save();

  res.status(200).json({
    success: true,
    message: `Food stall ${status}`,
    data: stall,
  });
};

/* ================= DELETE FOOD STALL (ADMIN) ================= */
export const deleteFoodStall = async (req, res) => {
  const { id } = req.params;

  const stall = await FoodStall.findById(id);
  if (!stall || stall.isDeleted) {
    throw new ApiError(404, "Food stall not found");
  }

  stall.isDeleted = true;
  await stall.save();

  res.status(200).json({
    success: true,
    message: "Food stall deleted",
  });
};
