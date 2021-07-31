const sql = require("sql");
sql.setDialect("postgres");

const queryGetOrderByUser = (userId) => ({
  name: "fetch-user-order",
  text: "SELECT * FROM orders WHERE userId = $1",
  values: [userId]
});

const queryGetOrderById = (orderId) => ({
  name: "fetch-order",
  text: `SELECT * FROM orders WHERE "orderId" = $1`,
  values: [orderId]
});

const queryUpdateOrderStatus = (status, orderId) => ({
  name: "update order status",
  text: `UPDATE orders SET  status=$1 WHERE "orderId" = $2 returning *`,
  values: [status, orderId]
});

const queryGetOrdersByRestaurant = (restaurantId) => ({
  name: "fetch-user-order",
  text: `SELECT * FROM orders WHERE "restaurantId" = $1`,
  values: [restaurantId]
});

const queryInsertOrder = (orderPayload) => {
  const { restaurantId, userId, status, totalAmount } = orderPayload;
  const Order = sql.define({
    name: "orders",
    columns: ["restaurantId", "userId", "dateTime", "totalAmount", "status"]
  });

  return Order.insert({
    restaurantId,
    userId,
    status,
    totalAmount,
    dateTime: new Date().toString()
  })
    .returning(Order.star())
    .toQuery();
};

const queryInsertOrderItems = ({ items }) => {
  const OrderItems = sql.define({
    name: "orderitems",
    columns: ["orderId", "itemId", "itemName", "quantity", "price"]
  });

  return OrderItems.insert(items).returning(OrderItems.star()).toQuery();
};

module.exports = {
  queryGetOrderByUser,
  queryInsertOrder,
  queryInsertOrderItems,
  queryGetOrdersByRestaurant,
  queryUpdateOrderStatus,
  queryGetOrderById
};
