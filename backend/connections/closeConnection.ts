import { connections, users } from "../db/db";

export const closeConnection = (uuid: string) => {
  console.log(`Close connection with id:${uuid}`);
  delete connections[uuid];
  delete users[uuid];
};
