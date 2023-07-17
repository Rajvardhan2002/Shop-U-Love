const Product = require("../models/product.model");

//shows cart HTML page
function getCart(req, res) {
  res.render("customers/cart/cart");
}

//handles fetch request to add items in the cart
async function addCartItem(req, res, next) {
  let product;
  try {
    product = await Product.findByID(req.body.productIdkey);
  } catch (error) {
    next(error);
    return;
  }
  const cart = res.locals.cart; //simply gives us an instantiated object of blueprint based on class Products
  cart.addItem(product); // this updates our cart array. So, we need to save this to our sessions
  req.session.cart = cart; // globally available cart array gets saved in session and gets deleted for new req-res cycle.

  /*we are not usingn req.sessions.save() here because that's needed only in case of redirecting. PLus, we will be using frontend based JS
    to send AJAX request to deal with adding items to our cart.  */

  res.status(201).json({
    message: "Successfully updated cart!",
    newTotalItemsInCart: cart.totalQuantity,
  });
}

//Ajax request to update orders when order button in cartpage is clicked.
function updateItem(req, res, next) {
  const cart = res.locals.cart;
  //updatedItemPrice will be getting an object in return
  const updatedItemData = cart.updateItem(
    req.body.productId,
    +req.body.newQuantity
  );
  req.session.cart = cart;
  res.json({
    message: "Successfully updated cart!",
    updatedCart: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      newItemPrice: updatedItemData.updatedItemPrice,
    },
  });
}

module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
  updateItem: updateItem,
};
