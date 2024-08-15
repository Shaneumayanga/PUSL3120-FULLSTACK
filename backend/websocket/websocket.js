const WebSocket = require("ws");
const url = require("url");
const jwt = require("../utils/jwt");

const clients = [];

module.exports.createWebsocketServer = () => {
  const wss = new WebSocket.Server({ port: 5000 });

  wss.on("connection", (ws, req) => {
    const queryParams = url.parse(req.url, true).query;

    const token = queryParams.token;

    const user = jwt.validateToken(token);

    const exitingUser = clients.find(
      (product) => product.user_id === user.user_id
    );

    if (!exitingUser) {
      clients.push({
        user_id: user.user_id,
        connection: ws,
      });
    }

    ws.on("close", () => {
      const index = clients.findIndex(
        (client) => client.user_id === user.user_id
      );
      if (index !== -1) {
        clients.splice(index, 1);
      }
    });
  });
};

module.exports.sendMessageToWsWithUserID = (user_id, msg) => {
  const client = clients.find((product) => product.user_id === user_id);
  client.connection.send(msg);
};

module.exports.broadcastToUsers = (msg) => {
  clients.forEach((client) => {
    client.connection.send(msg);
  });
};
