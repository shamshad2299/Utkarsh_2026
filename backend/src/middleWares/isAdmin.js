export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  if (req.user.adminStatus !== "active") {
    return res.status(403).json({
      message: "Admin approval required"
    });
  }

  next();
};
