const { CustomError } = require("restaurants-utils");

const {
  dbClient,
  queryGetOrderById,
  queryGetOrdersByRestaurant,
  queryGetOrderByUser,
  queryInsertOrder,
  queryInsertOrderItems,
  queryUpdateOrderStatus
} = require("../../db");

const { sendMessage: sendOrderStatus } = require("../../socket-server");

const placeOrder = async (req, res, next) => {
  try {
    const order = req.body;
    const { restaurantId } = req.params;

    const queryString = queryInsertOrder({ ...order, restaurantId, status: "Placed" });

    const { rows } = await dbClient.query(queryString);

    const placedOrder = rows[0];

    const orderItems = order.items.map((order) => ({
      ...order,
      orderId: placedOrder.orderId
    }));

    const queryStringOrderItems = queryInsertOrderItems({
      items: orderItems
    });

    const { rows: orderItemsRows } = await dbClient.query(queryStringOrderItems);

    res.status(200).json({ ...placedOrder, items: orderItemsRows });
  } catch (error) {
    next(error);
  }
};

const getOrderByRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      throw new CustomError("Restaurant id is missing");
    }

    const { rows } = await dbClient.query(queryGetOrdersByRestaurant(restaurantId));
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      throw new CustomError("order id is missing");
    }

    const { rows } = await dbClient.query(queryGetOrderById(orderId));

    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

const getOrderByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) throw new CustomError(403, "User id is missing");

    const queryString = queryGetOrderByUser(userId);

    const { rows } = await dbClient.query(queryString);

    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const { status } = req.body;

    if (!orderId) {
      throw new CustomError("order id is nissing");
    }
    const data = await dbClient.query(queryUpdateOrderStatus(status, orderId));

    sendOrderStatus(`OrderId: ${orderId} , Status: ${status} `);

    res.status(200).json({ orderId, status });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      throw new CustomError("order id is nissing");
    }
    const { rows } = await dbClient.query(queryUpdateOrderStatus("Cancelled", orderId));

    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getOrderById,
  getOrderByRestaurant,
  getOrderByUser,
  updateOrderStatus,
  cancelOrder
};
