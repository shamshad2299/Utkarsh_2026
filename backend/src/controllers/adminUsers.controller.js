import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";

/* ================= GET USERS (WITH FILTERS) ================= */
export const getUsers = async (req, res) => {
  const {
    search,
    active,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = {
    isDeleted: false, 
  };

  /*  Search by name or email */
  if (search) {
    filter.$or = [
      { email: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
      { _id: {$regex: search, $options: "i" }},
    ];
  }

  /*  Active / Blocked filter */
  if (active === "true") {
    filter.isBlocked = false;
  }

  if (active === "false") {
    filter.isBlocked = true;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -refreshToken -__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
};

/* ================= BLOCK / UNBLOCK USER ================= */
export const updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { active } = req.body;

  if (typeof active !== "boolean") {
    throw new ApiError(400, "Active status must be boolean");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { isBlocked: !active },
    { new: true }
  ).select("-password -refreshToken -__v");

  if (!user) {
    throw new ApiError(404, "User not found or already deleted");
  }

  res.status(200).json({
    success: true,
    message: active ? "User unblocked" : "User blocked",
    data: user,
  });
};

/* ================= UPDATE USER DETAILS (ADMIN) ================= */
export const updateUserDetails = async (req, res) => {
  const { userId } = req.params;

  const allowedUpdates = [
    "name",
    "email",
    "mobile_no",
    "city",
    "gender",
    "college",
    "course",
  ];

  const updates = {};

  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    updates,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken -__v");

  if (!user) {
    throw new ApiError(404, "User not found or already deleted");
  }

  res.status(200).json({
    success: true,
    message: "User details updated successfully",
    data: user,
  });
};
