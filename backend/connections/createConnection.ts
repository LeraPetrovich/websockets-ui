import { connections } from "../db/db";
import { type WebSocket } from "ws";

export const createConnection = (connection: WebSocket, uuid: string) => {
  connections[uuid] = connection;
  console.log(`New connection from id: ${uuid}`);
};
