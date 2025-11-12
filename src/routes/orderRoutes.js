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
router.put("/:orderId/complete", markAsDelivered);

module.exports = router;

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Rota para excluir pedido
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
