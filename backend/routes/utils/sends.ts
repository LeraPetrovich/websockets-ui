import { connections } from "../../db/db";

export const sendToClient = (index: number | string, type: string, data: any) => {
  const conn = connections[index];
  if (conn) {
    conn.send(
      JSON.stringify({
        type,
        data: typeof data === "string" ? data : JSON.stringify(data),
        id: 0,
      })
    );
  }
};

export const broadcast = (players: any[], type: string, data: any) => {
  for (const player of players) {
    sendToClient(player.indexPlayer, type, data);
  }
};
