import { game, connections } from "../../db/db";
import { checkStatusAttack } from "../utils";

export const addAttack = (
  uuid: string,
  data: any
) => {
  const { gameId, x, y, indexPlayer } = data;

  const currentGame = game.find((g) => g.gameId === gameId);
  if (!currentGame) {
    connections[uuid].send(
      JSON.stringify({
        type: "error",
        data: { message: "Game not found" },
        id: 0,
      })
    );
    return;
  }

  const attacker = currentGame.data.find(
    (item) => item.indexPlayer === indexPlayer
  );
  const defender = currentGame.data.find(
    (item) => item.indexPlayer !== indexPlayer
  );

  if (!attacker || !defender) return;

  const attackPos = { x, y };
  const { status, killedShipCells, surroundingCells } = checkStatusAttack(
    defender.ships,
    attackPos
  );

  for (const player of currentGame.data) {
    connections[player.indexPlayer].send(
      JSON.stringify({
        type: "attack",
        data: {
          position: attackPos,
          currentPlayer: indexPlayer,
          status,
        },
        id: 0,
      })
    );
  }

  if (status === "killed" && killedShipCells && surroundingCells) {
    for (const pos of killedShipCells) {
      currentGame.data.forEach((player) => {
        connections[player.indexPlayer].send(
          JSON.stringify({
            type: "attack",
            data: {
              position: pos,
              currentPlayer: indexPlayer,
              status: "killed",
            },
            id: 0,
          })
        );
      });
    }

    for (const pos of surroundingCells) {
      currentGame.data.forEach((player) => {
        connections[player.indexPlayer].send(
          JSON.stringify({
            type: "attack",
            data: {
              position: pos,
              currentPlayer: indexPlayer,
              status: "miss",
            },
            id: 0,
          })
        );
      });
    }
  }

  //   const defenderHasAlive = defender.ships.some((ship) => {
  //     const shipCells = Array.from({ length: ship.length }).map((_, i) => ({
  //       x: ship.position.x + (ship.direction ? i : 0),
  //       y: ship.position.y + (ship.direction ? 0 : i),
  //     }));

  //     return shipCells.some(
  //       (cell) => !ship.hits?.some((hit) => hit.x === cell.x && hit.y === cell.y)
  //     );
  //   });

  //   if (!defenderHasAlive) {
  //     currentGame.data.forEach((player) => {
  //       connections[player.indexPlayer].send(
  //         JSON.stringify({
  //           type: "finish",
  //           data: {
  //             winPlayer: indexPlayer,
  //           },
  //           id: 0,
  //         })
  //       );
  //     });
  //     return;
  //   }

  //после finish
  // updateWinners();

  const nextPlayer = defender.indexPlayer;
  currentGame.data.forEach((player) => {
    connections[player.indexPlayer].send(
      JSON.stringify({
        type: "turn",
        data: {
          currentPlayer: nextPlayer,
        },
        id: 0,
      })
    );
  });
};
