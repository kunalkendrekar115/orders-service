const { logger } = require("restaurants-utils");

var socketConnection = null;

function socketServer(ws, req) {
  socketConnection = ws;

  socketConnection.send("test message");
  listenFOrMessages();
}

const listenFOrMessages = () => {
  socketConnection.on("message", function (msg) {
    logger.info(msg);
  });
  logger.info("socket", req.testing);
};

function sendMessage(message) {
  if (socketConnection) socketConnection.send(message);
}

module.exports = { socketServer, sendMessage };
