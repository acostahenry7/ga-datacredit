const hanaClient = require("@sap/hana-client");
const connection = hanaClient.createConnection();
const hostname = process.env.DB_HOST;
const defaultConnectionParams = {
  serverNode: `${hostname}:${process.env.DB_PORT}`,
  UID: process.env.DB_USER,
  PWD: process.env.DB_PASSWORD,
  sslValidateCertificate: "false",
};

async function createHanaConnection(params) {
  if (!params) params = defaultConnectionParams;

  connection.connect(params);
}

module.exports = {
  createHanaConnection,
  db: connection,
};
