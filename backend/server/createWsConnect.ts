import { WebSocketServer } from "ws";

export const createWsConnect = (server:any) => {
  return new WebSocketServer({ server: server });
};
