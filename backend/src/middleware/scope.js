export const scope = (req, res, next) => {
  if (req.user.role === "SUPER_ADMIN") {
    req.scope = {};
  } else {
    req.scope = {
      companyId: req.user.companyId,
    };
  }

  next();
};
