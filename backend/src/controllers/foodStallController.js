// src/controllers/foodStallController.js
import { FoodStall } from "../models/foodStall.model.js";
import { ApiError } from "../utils/ApiError.js";
import { logAudit } from "../utils/auditLogger.js";


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
    numberOfStalls === undefined ||
    numberOfStalls === null
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existing = await FoodStall.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
    status: { $in: ["pending", "approved"] },
  });

  if (existing) {
    throw new ApiError(
      409,
      "You already have an active food stall request"
    );
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

  // AUDIT LOG (USER)
  await logAudit({
    req,
    action: "FOOD_STALL_REQUEST_CREATED",
    targetCollection: "FoodStall",
    targetId: stall._id,
    newData: stall,
  });

  res.status(201).json({
    success: true,
    message: "Food stall request submitted",
    data: stall,
  });
};

/* ================= GET MY FOOD STALL REQUESTS (USER) ================= */
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
  const { status, page = 1, limit = 20 } = req.query;

  const filter = { isDeleted: false };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [stalls, total] = await Promise.all([
    FoodStall.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    FoodStall.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: stalls,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
};

/* ================= UPDATE FOOD STALL STATUS (ADMIN) ================= */
export const updateFoodStallStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const stall = await FoodStall.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!stall) {
    throw new ApiError(404, "Food stall not found");
  }

  if (stall.status === status) {
    throw new ApiError(400, `Food stall already ${status}`);
  }

  // capture old state
  const oldData = stall.toObject();

  stall.status = status;
  await stall.save();

  // AUDIT LOG (ADMIN)
  await logAudit({
    req,
    action: `FOOD_STALL_${status.toUpperCase()}`,
    targetCollection: "FoodStall",
    targetId: stall._id,
    oldData,
    newData: stall,
  });

  res.status(200).json({
    success: true,
    message: `Food stall ${status} successfully`,
    data: stall,
  });
};

/* ================= DELETE FOOD STALL (ADMIN – SOFT DELETE) ================= */
export const deleteFoodStall = async (req, res) => {
  const { id } = req.params;

  const stall = await FoodStall.findById(id);

  if (!stall) {
    throw new ApiError(404, "Food stall not found");
  }

  if (stall.isDeleted) {
    throw new ApiError(400, "Food stall already deleted");
  }

  // capture old state
  const oldData = stall.toObject();

  stall.isDeleted = true;
  await stall.save();

  // AUDIT LOG (ADMIN)
  await logAudit({
    req,
    action: "FOOD_STALL_DELETED",
    targetCollection: "FoodStall",
    targetId: stall._id,
    oldData,
    newData: stall,
  });

  res.status(200).json({
    success: true,
    message: "Food stall deleted successfully",
  });
};
