const express = require("express");

const adminController = require("../controllers/admin.controllers");
const imageUploadMiddleware = require("../middlewares/image-upload");

const router = express.Router();

/*Since, adding /admin to every route is annoying therefore we can add a filter to our path in app.js where we execute our adminRoutes.  */

//shows page for product administration where we can add new products i.e. manage products
router.get("/products", adminController.getProducts); // /admin/products

//shows form for adding a newproduct i.e. add product form
router.get("/products/new", adminController.getNewProducts); // /admin/products/new

//handles form submission of add new product
router.post(
  "/products",
  imageUploadMiddleware,
  adminController.createNewProduct
); // /admin/products

//rendering update form i.e. view and edit button
router.get("/products/:id", adminController.getUpdateProduct);

//handling updated submitted form i.e. save button under update product form
router.post(
  "/products/:id",
  imageUploadMiddleware,
  adminController.updateProduct
); /*imageUploadMiddlewere is used because we have change 
enctype and in that case default way of parsing our data i.e. req.body doesn't work. We cannot do req.body.xyz until we have added this middlewaere
. Doing so without adding middleware will result into empty strings.
*/

/*using ajax to delete products. Hence, we are using delete http method to work with. Therefore, whenever a delete request is sent to 
browser this route handles it and all the post methods to this path is handled by above route */
router.delete("/products/:id", adminController.deleteExistingProduct);


router.get('/orders', adminController.getOrders);

router.patch('/orders/:id', adminController.updateOrder);




module.exports = router;
