const Cart = require("../models/cart.model");

function initializeCart(req, res, next) {
  let cart;
  //will be undefined early, that's why below, if condition will be true.
  if (!req.session.cart) {
    cart = new Cart(); // simply first gives access to that array cuz we have initialize a default empty array in our constructor
  } else {
    cart = new Cart(
      req.session.cart.items,
      req.session.cart.totalQuantity,
      req.session.cart.totalPrice
    ); // initiallized on the basis of previously saved cart in sessions.
  }
  /*SEssions works such that any methods that might've been attached to an object are not stored there.So, if we did something like 
  res.locals.cart = req.session.cart. Then we can't use the methods like addCartItem if we ever call locals.cart. That's why we first manually 
  instatiated that and then assigned that newly instantiated object to res.locals  so that all the methods are available. */

  res.locals.cart = cart; // ek object hai  based on class Cart blueprint jiske pass item naamak array hai jo ki empty rhega agar pheli baar.
  next();
}

module.exports = initializeCart;
