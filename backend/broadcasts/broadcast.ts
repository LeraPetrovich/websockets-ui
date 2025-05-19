import { users, connections } from "../db/db";

export const broadcast = () => {
  console.log(Object.keys(connections).length)
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid]; 
    const message = JSON.stringify(users);
    connection.send(message);
  });
};
