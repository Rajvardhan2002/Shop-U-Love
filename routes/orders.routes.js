const express = require("express");

const ordersController = require("../controllers/orders.controllers");

const router = express.Router();

router.get("/", ordersController.getOrders);

router.post("/", ordersController.addOrder); // /orders

router.get("/success", ordersController.getSuccess);

router.get("/failure", ordersController.getFailure);

module.exports = router;
