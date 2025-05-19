import { game, connections } from "../../db/db";
import { AddShipsMessage } from "../../db/types";

export const addShips = (uuid: string, data: any) => {
  const connection = connections[uuid];
  const currentGame = game.find((item) => item.gameId === data.gameId);

  if (!currentGame) {
    connection.send(
      JSON.stringify({
        type: "error",
        data: { message: "Game not found" },
        id: 0,
      })
    );
    return;
  }

  const playerData = currentGame.data.find((item) => item.indexPlayer === uuid);
  if (!playerData) {
    connection.send(
      JSON.stringify({
        type: "error",
        data: { message: "Player not in game" },
        id: 0,
      })
    );
    return;
  }

  if (playerData.ships.length > 0) {
    return;
  }

  playerData.ships = data.ships;

  const allPlayersReady = currentGame.data.every((p) => p.ships.length > 0);
  if (!allPlayersReady) return;

  currentGame.data.forEach((player) => {
    const connection = connections[player.indexPlayer];
    connection.send(
      JSON.stringify({
        type: "start_game",
        data: {
          ships: player.ships,
          currentPlayerIndex: player.indexPlayer,
        },
        id: 0,
      })
    );
  });
};
