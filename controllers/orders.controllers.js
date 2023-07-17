const stripe = require("stripe")(
  "sk_test_51NU9RySAFM89uPAzSVMsjAK4U1HuOWN5uEPXDOmaxzwGcqlDsJIpQLpn1HkMrEB3GmjyoG01AmMJdNUoojzIfs6P00XMpYNQYX"
);

const User = require("../models/user.models");
const Order = require("../models/orders.model");

//dedicated all-orders page for users
async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customers/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

//function for creating order when buy products button inside cart html page is clicked
async function addOrder(req, res, next) {
  const cart = res.locals.cart;
  let userDocument;
  try {
    userDocument = await User.getUserById(res.locals.uid); // return user from DB simply.
  } catch (error) {
    next(error);
    return;
  }

  const order = new Order(cart, userDocument);
  try {
    await order.save();
  } catch (error) {
    return next(error);
  }
  req.session.cart = null;

  //creating stripe session for checkout
  const session = await stripe.checkout.sessions.create({
    /*line items need an array so which then needs something of this type. So we can use map() */
    line_items: cart.items.map(function(item){
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.title,
          },
          // unit_amount_decimal: +item.product.price, //needed if we have a price less than a dollar
          unit_amount : +item.product.price.toFixed(2) * 100  //converting to cents to be safe
        },
        quantity: item.quantity,
      }
    }) , //end of map
    mode: "payment",
    success_url: `http://localhost:3000/orders/success`,
    cancel_url: `http://localhost:3000/orders/failure`,
  });

  res.redirect(303, session.url);
  // res.redirect("/orders"); //don't need this anymore
}

function getSuccess(req, res) {
  res.render("customers/orders/success");
}

function getFailure(req, res) {
  res.render("customers/orders/failure");
}
module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getFailure: getFailure,
  getSuccess: getSuccess,
};
