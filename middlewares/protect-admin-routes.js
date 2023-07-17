function protectAdminRoutes(req, res, next) {
  //if admin tries to access without logging-in.
  if (!res.locals.isAuth) {
    res.redirect("/401");
    return;
  }

  //if a logged-in users try to login
  if (req.path.startsWith("/admin") && !res.locals.isAdmin) {
    res.redirect("/403");
    return;
  }

  next();
}

module.exports = protectAdminRoutes;