const Product = require("../models/product.model");

//handle all products page
async function getAllProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render("customers/products/all-products", { products: products });
  } catch (error) {
    next(error);
  }
}

//shows product detail for every single item
async function getProductDetails(req, res, next) {
  try {
    const product = await Product.findByID(req.params.id); //returns a new product based on that class
    res.render("customers/products/product-details", { product: product });
    
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllProducts: getAllProducts,
  getProductDetails: getProductDetails,
};
