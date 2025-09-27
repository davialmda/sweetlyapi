const express = require("express");
const router = express.Router();
const { createOrder, getOrders } = require("../controllers/orderController");

// rota para criar pedido
router.post("/create", createOrder);

// rota para listar pedidos
router.get("/", getOrders);

module.exports = router; 