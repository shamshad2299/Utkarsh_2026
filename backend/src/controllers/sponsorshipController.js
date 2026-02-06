// src/controllers/sponsorshipController.js
import { Sponsorship } from "../models/sponsorship.model.js";
import { ApiError } from "../utils/ApiError.js";
import { logAudit } from "../utils/auditLogger.js";

/* ================= CREATE SPONSORSHIP REQUEST (USER) ================= */
export const createSponsorship = async (req, res) => {
  const {
    businessName,
    email,
    businessType,
    ownerName,
    phoneNumber,
    permanentAddress,
    sponsorshipCategory,
    amount,
  } = req.body;

  if (
    !businessName ||
    !email ||
    !businessType ||
    !ownerName ||
    !phoneNumber ||
    !permanentAddress ||
    !sponsorshipCategory ||
    amount === undefined ||
    amount === null
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  const existing = await Sponsorship.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
    status: { $in: ["pending", "approved"] },
  });

  if (existing) {
    throw new ApiError(
      409,
      "You already have an active sponsorship request"
    );
  }

  const sponsorship = await Sponsorship.create({
    businessName,
    email,
    businessType,
    ownerName,
    phoneNumber,
    permanentAddress,
    sponsorshipCategory,
    amount,
  });

  // AUDIT LOG (USER)
  await logAudit({
    req,
    action: "SPONSORSHIP_REQUEST_CREATED",
    targetCollection: "Sponsorship",
    targetId: sponsorship._id,
    newData: sponsorship,
  });

  res.status(201).json({
    success: true,
    message: "Sponsorship request submitted",
    data: sponsorship,
  });
};

/* ================= GET MY SPONSORSHIPS (USER) ================= */
export const getMySponsorships = async (req, res) => {
  const sponsorships = await Sponsorship.find({
    email: req.user.email,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: sponsorships.length,
    data: sponsorships,
  });
};

/* ================= GET ALL SPONSORSHIPS (ADMIN) ================= */
export const getAllSponsorships = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const filter = { isDeleted: false };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [sponsorships, total] = await Promise.all([
    Sponsorship.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Sponsorship.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: sponsorships,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
};

/* ================= UPDATE SPONSORSHIP STATUS (ADMIN) ================= */
    export const updateSponsorshipStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const sponsorship = await Sponsorship.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!sponsorship) {
    throw new ApiError(404, "Sponsorship not found");
  }

  if (sponsorship.status === status) {
    throw new ApiError(400, `Sponsorship already ${status}`);
  }

  // capture old state
  const oldData = sponsorship.toObject();

  sponsorship.status = status;
  await sponsorship.save();

  // AUDIT LOG (ADMIN)
  await logAudit({
    req,
    action: `SPONSORSHIP_${status.toUpperCase()}`,
    targetCollection: "Sponsorship",
    targetId: sponsorship._id,
    oldData,
    newData: sponsorship,
  });

  res.status(200).json({
    success: true,
    message: `Sponsorship ${status} successfully`,
    data: sponsorship,
  });
};

/* ================= DELETE SPONSORSHIP (ADMIN – SOFT DELETE) ================= */
export const deleteSponsorship = async (req, res) => {
  const { id } = req.params;

  const sponsorship = await Sponsorship.findById(id);

  if (!sponsorship) {
    throw new ApiError(404, "Sponsorship not found");
  }

  if (sponsorship.isDeleted) {
    throw new ApiError(400, "Sponsorship already deleted");
  }

  // capture old state
  const oldData = sponsorship.toObject();

  sponsorship.isDeleted = true;
  await sponsorship.save();

  // AUDIT LOG (ADMIN)
  await logAudit({
    req,
    action: "SPONSORSHIP_DELETED",
    targetCollection: "Sponsorship",
    targetId: sponsorship._id,
    oldData,
    newData: sponsorship,
  });

  res.status(200).json({
    success: true,
    message: "Sponsorship deleted successfully",
  });
};
