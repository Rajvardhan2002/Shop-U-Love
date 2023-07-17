const express = require("express");

const productsController = require("../controllers/products.controllers");

const router = express.Router();

//handle all products page
router.get("/products", productsController.getAllProducts);

//shows product detail for every single item
router.get('/products/:id',productsController.getProductDetails)

module.exports = router;
