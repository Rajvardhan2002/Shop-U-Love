const Product = require("../models/product.model");
const Order = require("../models/orders.model");

//shows page for product administration where we can add new products i.e. manage products
async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render("admin/products/all-products", {
      productArrOfObjOfTypeProductsClass: products,
    });
  } catch (error) {
    next(error);
    return; // this can be omitted cuz there's no code after this line.
  }
}

//shows form for adding a newproduct i.e. add product form
function getNewProducts(req, res) {
  res.render("admin/products/new-product");
}

//handle new product submission page
async function createNewProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  }); /**here we are passing an object as argument cuz there we are accepting only one object as parameter. Since req.body is an object 
  which contains bunch of key value pairs of all those items send along with requets on which we are applying rest operator that pulls out 
  the key value pairs and store them seperately. While console.log(file)  we have seen that it doesn't includes image key that's why passed 
  seperately.*/
  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/products"); // this can also be put inside try block after await
}

//rendering update form i.e. view and edit button
async function getUpdateProduct(req, res, next) {
  try {
    const product = await Product.findByID(req.params.id);
    res.render("admin/products/update-product", { product: product });
  } catch (error) {
    next(error);
  }
}

//handling updated submitted form i.e. save button under update product form
async function updateProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    _id: req.params.id,
    /* passing this cuz we will search product on the basis of this id. We are passing _id cuz in our constructor we look productData._id*/
  });

  if (req.file) {
    product.replaceImage(req.file.filename);
  }

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }
  res.redirect("/admin/products");
}

//sending post req for deleting existing product
async function deleteExistingProduct(req, res, next) {
  //Since we are using this.id for finding our product from database. Hence, we need to instantiate product.
  let product;
  try {
    product = await Product.findByID(req.params.id);
    await product.deleteExistingProduct();
  } catch (error) {
    return next(error);
  }

  res.json({ message: "Product Successfullly deleted from database" });
}

//renders html page showing all orders places by customers
async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render("admin/orders/admin-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

// updating order status when admin updates an order placed by the user via ajax
async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);//returns us an object based on order class blueprint

    order.status = newStatus;

    await order.save();// update the new status of order.

    res.json({ message: "Order updated", newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts: getProducts,
  getNewProducts: getNewProducts,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteExistingProduct: deleteExistingProduct,
  getOrders: getOrders,
  updateOrder: updateOrder,
};
