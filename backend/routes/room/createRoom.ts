import { users, rooms } from "../../db/db";
import { broadcastRooms } from "../../broadcasts/broadcastRooms";
import { v4 as uuidv4 } from "uuid";

export const createRoom = (uuid: string) => {
  const userName = users[uuid].name;
  const roomUuid = uuidv4();

  const newRoomData = {
    roomId: roomUuid,
    roomUsers: [
      {
        name: userName,
        index: uuid,
      },
    ],
  };

  rooms.push(newRoomData);
  broadcastRooms();
};
