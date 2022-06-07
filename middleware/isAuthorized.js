const isAuthorized = (req, res, next) => {
  res.locals.user = req.session?.user;
  res.locals.isAuthorized = req.session?.isAuthorized;
  next();
};

module.exports = isAuthorized;
