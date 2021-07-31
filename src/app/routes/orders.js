const express = require("express");
const { verifyToken } = require("restaurants-utils");

const {
  placeOrder,
  getOrderById,
  getOrderByRestaurant,
  getOrderByUser,
  updateOrderStatus,
  cancelOrder
} = require("../controllers");

const { isValidData, validRatingData } = require("./helpers");

const router = express.Router();

router.get("/:orderId", getOrderById);
router.patch("/:orderId", updateOrderStatus);
router.delete("/:orderId", cancelOrder);

router.get("/user", verifyToken, getOrderByUser);

router.post("/restaurant/:restaurantId", verifyToken, placeOrder);
router.get("/restaurant/:restaurantId", getOrderByRestaurant);

module.exports = { router };
