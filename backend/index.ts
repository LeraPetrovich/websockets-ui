import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { createServer } from "./server/createServer";
import { createWsConnect } from "./server/createWsConnect";

//events
import { handleMessage } from "./events/handleMessage";

//utils
import { createConnection } from "./connections/createConnection";
import { closeConnection } from "./connections/closeConnection";

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = createServer();
const wsServer = createWsConnect(server);

wsServer.on("connection", (connection: any, request: any) => {
  const uuid = uuidv4();
  createConnection(connection, uuid);

  connection.on("message", (message: any) => {
    try {
      const parsed = JSON.parse(message);
      handleMessage(parsed, uuid);
    } catch (err) {
      console.error("Error:", err);
      connection.send(JSON.stringify({ error: "Invalid JSON format" }));
    }
  });

  connection.on("close", () => {
    closeConnection(uuid);
  });
});

server.listen(PORT, () => {
  console.log(`Websocket is running on port ws://localhost:${PORT}`);
});
