const sql = require("sql");
sql.setDialect("postgres");

const queryGetOrderByUser = (userId) => {
  return `SELECT a.*, array_to_json(array_agg(row_to_json(u.*))) as orderItems 
  FROM orders a INNER JOIN orderitems u USING("orderId") where "userId"='${userId}' GROUP BY "orderId"`;
};

const queryGetOrderById = (orderId) => {
  return `SELECT a.*, array_to_json(array_agg(row_to_json(u.*))) as orderItems 
  FROM orders a INNER JOIN orderitems u USING("orderId") where "orderId"='${orderId}' GROUP BY "orderId"`;
};

const queryUpdateOrderStatus = (status, orderId) => ({
  name: "update order status",
  text: `UPDATE orders SET  status=$1 WHERE "orderId" = $2 returning *`,
  values: [status, orderId]
});

const queryGetOrdersByRestaurant = (restaurantId) => {
  return `SELECT a.*, array_to_json(array_agg(row_to_json(u.*))) as orderItems 
  FROM orders a INNER JOIN orderitems u USING("orderId") where "restaurantId"='${restaurantId}' GROUP BY "orderId"`;
};

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
