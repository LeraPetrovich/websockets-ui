import { users, connections } from "../../db/db";
import { updateWinners } from "../updateWinners";

export const regUser = (
  uuid: string,
  data: { name: string; password: string }
) => {
  users[uuid] = data;
  const postData = {
    type: "reg",
    data: JSON.stringify({
      name: data.name,
      index: uuid,
      error: false,
      errorText: "",
    }),
    id: 0,
  };
  const connection = connections[uuid];
  connection.send(JSON.stringify(postData));
  updateWinners();
};
