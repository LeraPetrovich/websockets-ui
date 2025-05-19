import { rooms, users, connections } from "../../db/db";
import { broadcastRooms } from "../../broadcasts/broadcastRooms";
import { createGame } from "../game/createGame";

export const addUserToRoom = (uuid: string, data: { indexRoom: string }) => {
  const connection = connections[uuid];
  const room = rooms.find((item) => item.roomId == data.indexRoom);
  if (!room) {
    connection.send(
      JSON.stringify({
        type: "error",
        data: { message: `Room not found ${rooms}` },
        id: 0,
      })
    );
    return;
  }

  if (room.roomUsers.length >= 2) {
    connection.send(
      JSON.stringify({
        type: "error",
        data: { message: "Room is full" },
        id: 0,
      })
    );
    return;
  }

  const userName = users[uuid].name;
  room.roomUsers.push({
    name: userName,
    index: uuid,
  });

  broadcastRooms();

  createGame(room.roomId);
};
