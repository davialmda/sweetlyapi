// Rotas responsáveis por criar e listar pedidos de entrega.
const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrdersByUser,
} = require("../controllers/orderController");

router.post("/create", createOrder);
router.get("/", getOrders);
router.get("/user/:userId", getOrdersByUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/available", orderController.getAvailableOrders);
router.post("/accept", orderController.acceptOrder);

module.exports = router;

