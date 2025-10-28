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

<<<<<<< HEAD

// Controller para listar todos os pedidos
exports.getOrders = async (req, res) => {
  try {
    // busca todos os pedidos no banco (SELECT *)
    const orders = await Order.findAll();
    // retorna os pedidos como JSON
    res.json(orders);
  } catch (err) {
    // caso dê erro na consulta
    res.status(500).json({ error: err.message });
=======
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
>>>>>>> c096da21db9f4c7a4d22f6dca18531145b792b85
  }
};

// Controller para listar pedidos com filtros
exports.getOrdersWithFilters = async (req, res) => {
  try {
    const { status, date } = req.query; // pega filtros da query string
    const where = {}; // objeto de filtros dinâmicos

    // se o usuário passar status na URL -> /orders?status=pendente
    if (status) {
      where.status = status;
    }

    // se o usuário passar data na URL -> /orders?date=2025-10-06
    if (date) {
      // supondo que seu modelo Order tem um campo "createdAt"
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      where.createdAt = {
        [require("sequelize").Op.between]: [start, end],
      };
    }

    // busca no banco com filtros aplicados
    const orders = await Order.findAll({ where });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lista apenas os pedidos disponíveis (pendentes)
exports.getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { status: "pendente" },
      include: [
        {
          association: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (orders.length === 0) {
      return res.status(200).json({ message: "Nenhum pedido disponível" });
    }

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar pedidos pendentes" });
  }
};

// Entregador aceita um pedido
exports.acceptOrder = async (req, res) => {
  try {
    const { orderId, deliveryManId } = req.body;

    if (!orderId || !deliveryManId) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    if (order.status !== "pendente") {
      return res.status(400).json({ error: "Pedido já foi aceito ou entregue" });
    }

    // Atualiza o pedido com o entregador e status
    order.deliveryManId = deliveryManId;
    order.status = "aceito";
    await order.save();

    return res.json({ message: "Pedido aceito com sucesso", order });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao aceitar pedido" });
  }
};

// Marcar o pedido como entregue
exports.markAsDelivered = async (req, res) => {
  try {
    const { orderId } = req.params; // o ID virá pela URL, ex: /orders/entregar/5
    const id = Number(orderId);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "ID de pedido inválido" });
    }

    // Busca o pedido no banco
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    // Verifica se ele já foi entregue
    if (order.status === "entregue") {
      return res.status(400).json({ error: "Pedido já foi entregue" });
    }

    // Atualiza o status e salva
    order.status = "entregue";
    await order.save();

    return res.json({
      message: "Pedido marcado como entregue com sucesso",
      order,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao marcar pedido como entregue" });
  }
};






