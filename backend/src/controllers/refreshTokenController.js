import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";
import { generateAccessToken } from "./userController.js";

export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== token)
      return res.sendStatus(403);

    const newAccessToken = generateAccessToken(user);

    return res.json({
      success: true,
      accessToken: newAccessToken
    });

  } catch {
    return res.sendStatus(401);
  }
};
