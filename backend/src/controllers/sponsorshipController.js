// src/controllers/sponsorshipController.js
import { Sponsorship } from "../models/sponsorship.model.js";
import { ApiError } from "../utils/ApiError.js";

/* ================= CREATE SPONSORSHIP REQUEST ================= */
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
    amount === undefined
  ) {
    throw new ApiError(400, "All fields are required");
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

  res.status(201).json({
    success: true,
    message: "Sponsorship request submitted",
    data: sponsorship,
  });
};

/* ================= GET MY SPONSORSHIPS ================= */
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
  const { status } = req.query;

  const filter = { isDeleted: false };
  if (status) filter.status = status;

  const sponsorships = await Sponsorship.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: sponsorships.length,
    data: sponsorships,
  });
};

/* ================= UPDATE SPONSORSHIP STATUS (ADMIN) ================= */
export const updateSponsorshipStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const sponsorship = await Sponsorship.findById(id);
  if (!sponsorship || sponsorship.isDeleted) {
    throw new ApiError(404, "Sponsorship not found");
  }

  sponsorship.status = status;
  await sponsorship.save();

  res.status(200).json({
    success: true,
    message: `Sponsorship ${status}`,
    data: sponsorship,
  });
};

/* ================= DELETE SPONSORSHIP (ADMIN) ================= */
export const deleteSponsorship = async (req, res) => {
  const { id } = req.params;

  const sponsorship = await Sponsorship.findById(id);
  if (!sponsorship || sponsorship.isDeleted) {
    throw new ApiError(404, "Sponsorship not found");
  }

  sponsorship.isDeleted = true;
  await sponsorship.save();

  res.status(200).json({
    success: true,
    message: "Sponsorship deleted",
  });
};
