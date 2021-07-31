const pg = require("pg");
const { logger } = require("restaurants-utils");
const queries = require("./queries");

const conString =
  "postgres://eyuxwvum:taCpGwIohpWjux6XQNrFQSLfe_OMI7FZ@chunee.db.elephantsql.com/eyuxwvum";

const dbClient = new pg.Client(conString);

const connectToDatabase = async () => {
  dbClient.connect(function (err) {
    if (err) {
      return logger.error(err);
    }
  });
};

module.exports = {
  dbClient,
  connectToDatabase,
  ...queries
};
