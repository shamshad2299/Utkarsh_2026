// export const isAdmin = (req, res, next) => {
//   if (!req.admin) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   if (req.admin.role !== "admin") {
//     return res.status(403).json({ message: "Admin access only" });
//   }

//   if (req.admin.adminStatus !== "active") {
//     return res.status(403).json({
//       message: "Admin approval required",
//     });
//   }

//   next();
// };
