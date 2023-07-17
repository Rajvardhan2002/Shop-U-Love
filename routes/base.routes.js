const express = require("express");

const router = express.Router();

router.get("/", function (req, res) {
  if (!res.locals.isAdmin) {
    res.redirect("/products");
    return;
  }
  res.redirect("/admin/products");
});

router.get("/401", function (req, res) {
  res.status(401).render("shared/401");
});

router.get("/403", function (req, res) {
  res.status(403).render("shared/403");
});

module.exports = router;
