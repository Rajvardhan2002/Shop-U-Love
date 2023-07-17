const express = require("express");
const path = require("path");
const csrf = require("csurf");
const expressSession = require("express-session");

const db = require("./data/database");
const addCSRFTokenMiddleware = require("./middlewares/csrf-token");
const handleErrorMiddleware = require("./middlewares/error-handle");
const sessionConfiguration = require("./configurations/session");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectAdminRoutesMiddleware = require("./middlewares/protect-admin-routes");
const notFoundMiddleware = require("./middlewares/not-found");
const cartMiddleware = require("./middlewares/save-cart-in-session");
const updateCartPricesMiddleware = require("./middlewares/update-cart-prices");
const authRoutes = require("./routes/auth.routes");
const baseRoutes = require("./routes/base.routes");
const productsRoutes = require("./routes/products.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const ordersRoutes = require("./routes/orders.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));

//We need to config our session before we set tokens cuz csrf needs a session in order to behave correctly. Thus, order matters here.
const sessionConfig = sessionConfiguration();
app.use(expressSession(sessionConfig));

app.use(csrf());
app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);
app.use(addCSRFTokenMiddleware);

app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", protectAdminRoutesMiddleware, ordersRoutes);
app.use("/admin", protectAdminRoutesMiddleware, adminRoutes);
/* Therefore any request starting with /admin is handled by this route and then the /admin is then removed from
the path and then it checks for the rest of the path in the adminRoute file. So, in the end it's something like '/admin/....' 
*/

app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

let port = 3000;

if (process.env.PORT) {
  port = process.env.PORT;
}

db.connectToDatabase()
  .then(function () {
    app.listen(port);
  })
  .catch(function (error) {
    console.log("Failed to connecct to the database");
    console.log(error);
  });
