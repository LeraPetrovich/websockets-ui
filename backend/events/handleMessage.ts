import { MessageType } from "../db/types";

//reg
import { regUser } from "../routes/reg/regUser";

//room
import { createRoom } from "../routes/room/createRoom";
import { addUserToRoom } from "../routes/room/addUserToRoom";

//game
import { addShips } from "../routes/game/addShips";
import { addAttack } from "../routes/game/addAttack";

export const handleMessage = (message: MessageType, uuid: string) => {
  console.log(message);
  try {
    switch (message.type) {
      case "reg":
        regUser(uuid, message.data);
        break;
      case "create_room":
        createRoom(uuid);
        break;

      case "add_user_to_room":
        addUserToRoom(uuid, JSON.parse(message.data as any));
        break;
      case "add_ships":
        addShips(uuid, JSON.parse(message.data as any));
        break;
      case "attack":
        addAttack(uuid, JSON.parse(message.data as any));
        break;
      case "randomAttack":
        addAttack(uuid, JSON.parse(message.data as any), true);
        break;
      default:
        throw new Error("No valid type message");
    }
  } catch (error) {
    throw new Error(error as string);
  }
};
