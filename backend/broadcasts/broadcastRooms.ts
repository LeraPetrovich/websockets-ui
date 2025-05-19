import { rooms, connections } from "../db/db";
import { updateWinners } from "../routes/updateWinners";

export const broadcastRooms = () => {
  const availableRooms = rooms.filter(r => r.roomUsers.length === 1);
  const message = JSON.stringify({
    type: "update_room",
    data: JSON.stringify(availableRooms),
    id: 0,
  });

  Object.values(connections).forEach(conn => conn.send(message));
  updateWinners();
};
