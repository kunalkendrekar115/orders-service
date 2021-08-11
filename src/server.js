const db = require("./db");
const express = require("express");
const path = require("path");

const { orderRoute } = require("./app/routes");
const { logger, errorHandler } = require("restaurants-utils");

db.connectToDatabase();

const app = express();

const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const jsyaml = require("js-yaml");

const spec = fs.readFileSync("api.yaml", "utf8");
const swaggerDocument = jsyaml.load(spec);

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/orders", orderRoute);

app.get("/socket-client", function (req, res) {
  res.sendFile(path.join(__dirname + "/socket-client/index.html"));
});

app.get("/socket-client/index.js", function (req, res) {
  res.sendFile(path.join(__dirname + "/socket-client/index.js"));
});

app.use(errorHandler);

const expressWs = require("express-ws")(app);
const { socketServer } = require("./socket-server");

app.ws("/", socketServer);

app.listen(9000, () => logger.info("Running Order API Service"));
