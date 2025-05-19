import { rooms, connections, game } from "../../db/db";
import type { ShipsType } from "../../db/types";

type GamePlayerData = {
  ships: ShipsType[];
  indexPlayer: string | number;
};

export const createGame = (id: string | number) => {
  const room = rooms.find((r) => r.roomId === id);
  if (!room) {
    return;
  }

  const newGameData: {
    gameId: string | number;
    data: GamePlayerData[];
  } = {
    gameId: room.roomId,
    data: [],
  };

  room.roomUsers.forEach((player) => {
    const connection = connections[player.index];
    newGameData.data.push({
      ships: [],
      indexPlayer: player.index,
    });
    const message = {
      type: "create_game",
      data: JSON.stringify({
        idGame: room.roomId,
        idPlayer: player.index,
      }),
      id: 0,
    };
    connection.send(JSON.stringify(message));
  });

  game.push(newGameData);
};
