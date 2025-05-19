type Position = { x: number; y: number };
type AttackStatus = "miss" | "shot" | "killed";
type ShipsType = {
  position: Position;
  length: number;
  direction: boolean;
  hits?: Position[];
};

export const checkStatusAttack = (
  defenderShips: ShipsType[],
  attackPos: Position
): {
  status: AttackStatus;
  killedShipCells?: Position[];
  surroundingCells?: Position[];
} => {
  for (const ship of defenderShips) {
    const shipCells: Position[] = [];

    for (let i = 0; i < ship.length; i++) {
      shipCells.push({
        x: ship.position.x + (ship.direction ? i : 0),
        y: ship.position.y + (ship.direction ? 0 : i),
      });
    }

    const isHit = shipCells.some(
      (cell) => cell.x === attackPos.x && cell.y === attackPos.y
    );

    if (isHit) {
      if (!ship.hits) ship.hits = [];
      const alreadyHit = ship.hits.some(
        (hit) => hit.x === attackPos.x && hit.y === attackPos.y
      );
      if (!alreadyHit) {
        ship.hits.push(attackPos);
      }

      const isKilled = shipCells.every((cell) =>
        ship.hits!.some((hit) => hit.x === cell.x && hit.y === cell.y)
      );

      if (isKilled) {
        const surroundingCells = getSurroundingCells(shipCells);
        return {
          status: "killed",
          killedShipCells: shipCells,
          surroundingCells,
        };
      }

      return { status: "shot" };
    }
  }

  return { status: "miss" };
};

function getSurroundingCells(shipCells: Position[]): Position[] {
  const surrounding = new Set<string>();

  for (const { x, y } of shipCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = x + dx;
        const ny = y + dy;
        const key = `${nx},${ny}`;
        if (!shipCells.some((cell) => cell.x === nx && cell.y === ny)) {
          surrounding.add(key);
        }
      }
    }
  }

  return [...surrounding].map((str) => {
    const [x, y] = str.split(",").map(Number);
    return { x, y };
  });
}