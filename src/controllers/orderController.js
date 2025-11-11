// Interações de pedidos dependem do model Order e dos dados públicos do usuário.
const Order = require("../models/order");
const { findUserById, sanitizeUser } = require("../models/userModel");
const { createLog } = require("./logController");

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

    if (itemName.length > 255) {
      return res.status(400).json({ error: "Item deve ter no máximo 255 caracteres" });
    }

    if (deliveryAddress.length < 5 || deliveryAddress.length > 500) {
      return res.status(400).json({ error: "Endereço deve ter entre 5 e 500 caracteres" });
    }

    if (!Number.isInteger(quantityValue) || quantityValue <= 0 || quantityValue > 1000) {
      return res
        .status(400)
        .json({ error: "Quantidade deve ser um inteiro entre 1 e 1000" });
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

    // Registra log da criação do pedido
    await createLog(
      'CREATE',
      'Order',
      order.id,
      `Pedido ${order.id} criado - Item: ${order.item}`,
      userIdValue,
      req.ip || req.connection.remoteAddress
    );

    return res.status(201).json({
      message: "Pedido criado com sucesso",
      order: {
        ...order.toJSON(),
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
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
    console.error('Erro ao listar pedidos:', error);
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
    console.error('Erro ao listar pedidos do usuario:', error);
    return res.status(500).json({ error: "Erro ao listar pedidos do usuario" });
  }
};

// Aceita um pedido e muda status para "em_andamento".
exports.acceptOrder = async (req, res) => {
  const { orderId } = req.params;
  const orderIdValue = Number(orderId);

  if (!Number.isInteger(orderIdValue) || orderIdValue <= 0) {
    return res.status(400).json({ error: "ID do pedido invalido" });
  }

  try {
    const order = await Order.findByPk(orderIdValue, {
      include: [{
        association: "user",
        attributes: ["id", "name", "email"],
      }],
    });

    if (!order) {
      return res.status(404).json({ error: "Pedido nao encontrado" });
    }

    if (order.status !== "pendente") {
      return res.status(400).json({ error: "Pedido ja foi aceito ou entregue" });
    }

    await order.update({ status: "em_andamento" });

    // Registra log da aceitação do pedido
    await createLog(
      'UPDATE',
      'Order',
      orderIdValue,
      `Pedido ${orderIdValue} foi aceito`,
      null,
      req.ip || req.connection.remoteAddress
    );

    return res.status(200).json({
      message: "Pedido aceito com sucesso",
      order: order.toJSON(),
    });
  } catch (error) {
    console.error('Erro ao aceitar pedido:', error);
    return res.status(500).json({ error: "Erro ao aceitar pedido" });
  }
};

// Marca um pedido como entregue e finaliza a tarefa do entregador.
exports.markAsDelivered = async (req, res) => {
  const { orderId } = req.params;
  const orderIdValue = Number(orderId);

  if (!Number.isInteger(orderIdValue) || orderIdValue <= 0) {
    return res.status(400).json({ error: "ID do pedido invalido" });
  }

  try {
    const order = await Order.findByPk(orderIdValue, {
      include: [{
        association: "user",
        attributes: ["id", "name", "email"],
      }],
    });

    if (!order) {
      return res.status(404).json({ error: "Pedido nao encontrado" });
    }

    if (order.status !== "em_andamento") {
      return res.status(400).json({ error: "Pedido deve estar em andamento para ser finalizado" });
    }

    await order.update({ status: "entregue" });

    // Registra log da finalização do pedido
    await createLog(
      'UPDATE',
      'Order',
      orderIdValue,
      `Pedido ${orderIdValue} foi marcado como entregue`,
      null,
      req.ip || req.connection.remoteAddress
    );

    return res.status(200).json({
      message: "Pedido marcado como entregue com sucesso",
      order: order.toJSON(),
    });
  } catch (error) {
    console.error('Erro ao finalizar pedido:', error);
    return res.status(500).json({ error: "Erro ao finalizar pedido" });
  }
};
