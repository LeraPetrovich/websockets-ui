import { game, connections } from "../../db/db";
import { checkStatusAttack } from "../utils/utils";
import { broadcast } from "../utils/sends";
import { updateWinners } from "../updateWinners";

export const addAttack = (uuid: string, data: any, random = false): void => {
  const { gameId, indexPlayer, x, y } = data;
  const currentGame = game.find((g) => g.gameId === gameId);

  if (!currentGame) {
    connections[uuid]?.send(
      JSON.stringify({
        type: "error",
        data: { message: "Game not found" },
        id: 0,
      })
    );
    return;
  }

  const attacker = currentGame.data.find((p) => p.indexPlayer === indexPlayer);
  const defender = currentGame.data.find((p) => p.indexPlayer !== indexPlayer);
  if (!attacker || !defender) return;

  if (random) {
    const attackedPositions =
      attacker.hits?.map((hit) => `${hit.x},${hit.y}`) || [];
    const availablePositions: { x: number; y: number }[] = [];
    const BOARD_SIZE = 10;

    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        const key = `${x},${y}`;
        if (!attackedPositions.includes(key)) {
          availablePositions.push({ x, y });
        }
      }
    }

    if (availablePositions.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const randomPos = availablePositions[randomIndex];

    return addAttack(
      uuid,
      {
        gameId,
        indexPlayer,
        x: randomPos.x,
        y: randomPos.y,
      },
      false
    );
  }

  const attackPos = { x, y };
  const { status, killedShipCells, surroundingCells } = checkStatusAttack(
    defender.ships,
    attackPos
  );

  if (!attacker.hits) attacker.hits = [];
  attacker.hits.push({ ...attackPos, status });

  broadcast(currentGame.data, "attack", {
    position: attackPos,
    currentPlayer: indexPlayer,
    status,
  });

  if (status === "killed" && killedShipCells && surroundingCells) {
    for (const pos of killedShipCells) {
      attacker.hits.push({ ...pos, status: "killed" });
      broadcast(currentGame.data, "attack", {
        position: pos,
        currentPlayer: indexPlayer,
        status: "killed",
      });
    }

    for (const pos of surroundingCells) {
      attacker.hits.push({ ...pos, status: "miss" });
      broadcast(currentGame.data, "attack", {
        position: pos,
        currentPlayer: indexPlayer,
        status: "miss",
      });
    }
  }

  const defenderHasAlive = defender.ships.some((ship) => {
    const shipCells = Array.from({ length: ship.length }).map((_, i) => ({
      x: ship.position.x + (ship.direction ? i : 0),
      y: ship.position.y + (ship.direction ? 0 : i),
    }));

    return shipCells.some(
      (cell) => !ship.hits?.some((hit) => hit.x === cell.x && hit.y === cell.y)
    );
  });

  if (!defenderHasAlive) {
    broadcast(currentGame.data, "finish", { winPlayer: indexPlayer });
    updateWinners();
    return;
  }

  const nextPlayer = defender.indexPlayer;
  broadcast(currentGame.data, "turn", { currentPlayer: nextPlayer });
};
