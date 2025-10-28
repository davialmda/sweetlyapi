// Rotas responsáveis por criar e listar pedidos de entrega.
const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrdersByUser,
  acceptOrder,
  markAsDelivered
} = require("../controllers/orderController");

router.post("/create", createOrder);
router.get("/", getOrders);
router.get("/user/:userId", getOrdersByUser);
router.put("/:orderId/accept", acceptOrder);
router.post("/entregar/:orderId", markAsDelivered);

module.exports = router;