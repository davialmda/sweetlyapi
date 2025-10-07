// Interações de pedidos dependem do model Order e dos dados públicos do usuário.
const Order = require("../models/order");
const { findUserById, sanitizeUser } = require("../models/userModel");

// Cria um pedido já vinculado a um usuário existente.
exports.createOrder = async (req, res) => {
  try {
    const { item, quantity, address, userId } = req.body;

    const itemName = typeof item === "string" ? item.trim() : "";
    const deliveryAddress = typeof address === "string" ? address.trim() : "";
    const quantityValue = Number(quantity);
    const userIdValue = Number(userId);

    // Verifica campos obrigatórios e retorna mensagens específicas.
    if (!itemName || !deliveryAddress) {
      return res
        .status(400)
        .json({ error: "Item e endereco sao obrigatorios" });
    }

    if (!Number.isInteger(quantityValue) || quantityValue <= 0) {
      return res
        .status(400)
        .json({ error: "Quantidade deve ser um inteiro positivo" });
    }

    if (!Number.isInteger(userIdValue) || userIdValue <= 0) {
      return res.status(400).json({ error: "Usuario invalido" });
    }

    // Garante que o usuário passado realmente existe antes de registrar o pedido.
    const user = await findUserById(userIdValue);
    if (!user) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }

    // Persiste o pedido e retorna também os dados públicos do usuário.
    const order = await Order.create({
      item: itemName,
      quantity: quantityValue,
      address: deliveryAddress,
      userId: userIdValue,
    });

    return res.status(201).json({
      message: "Pedido criado com sucesso",
      order: {
        ...order.toJSON(),
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar pedido" });
  }
};

// Lista todos os pedidos, incluindo informações básicas do usuário dono.
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          association: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar pedidos" });
  }
};

// Lista somente os pedidos do usuário informado em :userId.
exports.getOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  const userIdValue = Number(userId);

  if (!Number.isInteger(userIdValue) || userIdValue <= 0) {
    return res.status(400).json({ error: "Usuario invalido" });
  }

  try {
    const user = await findUserById(userIdValue);
    if (!user) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }

    const orders = await Order.findAll({
      where: { userId: userIdValue },
      order: [["createdAt", "DESC"]],
    });

    // Embala os pedidos junto com os dados públicos do solicitante.
    return res.json({
      user: sanitizeUser(user),
      orders,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar pedidos do usuario" });
  }
};
