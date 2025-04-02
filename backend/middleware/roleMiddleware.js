module.exports = (roles) => {
  return (req, res, next) => {
    console.log("User role: ", req.user.role);
    console.log("Allowed roles: ", roles);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};
